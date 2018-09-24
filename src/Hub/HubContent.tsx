import * as React from "react";
import * as DevOps from "azure-devops-extension-sdk";

import "./HubContent.scss";

export interface IHubContentState {
    userName?: string;
    projectName?: string;
    iframeUrl?: string;
    extensionData?: string;
}

export class HubContent extends React.Component<{}, IHubContentState> {

    private _dataManager?: DevOps.IExtensionDataManager;

    constructor(props: {}) {
        super(props);

        this.state = {
            iframeUrl: window.location.href
        };
    }

    public componentDidMount() {

        DevOps.init({
            applyTheme: true,
            loaded: true
        });

        DevOps.ready(() => {

            const userName = DevOps.getUser().name;
            this.setState({ userName });

            DevOps.getService("ms.vss-tfs-web.tfs-page-data-service").then((projectService: DevOps.IProjectPageService) => {
                projectService.getProject().then((project) => {
                    if (project) {
                        this.setState({ projectName: project.name });
                    }
                });
            });

            DevOps.getAccessToken().then((accessToken) => {
                DevOps.getService("ms.vss-features.extension-data-service").then((extDataService: DevOps.IExtensionDataService) => {
                    extDataService.getExtensionDataManager(DevOps.getExtensionContext().id, accessToken).then((dataMgr) => {
                        this._dataManager = dataMgr;
                        this._dataManager.getValue("test-id").then((data: string) => {
                            this.setState({ extensionData: data });
                        });
                    });
                });
            });
        });
    }

    public render(): JSX.Element {

        const { userName, projectName, iframeUrl, extensionData } = this.state;

        return (
            <div>
                <h1>Hello, {userName}!</h1>
                {
                    projectName &&
                    <h2>Project: {projectName}</h2>
                }
                
                <h2>iframe URL: {iframeUrl}</h2>
            
                <button onClick={this.onURLHashTestClick}>URL hash test</button>
                
                {
                    extensionData &&
                    <h3>Extension data: {extensionData}</h3>
                }
                
                <button onClick={this.onMessagePromptClick}>Message prompt</button>
                <button onClick={this.onCustomPromptClick}>Custom prompt</button>
                <button onClick={this.onPanelClick}>Panel</button>
            </div>
        );
    }

    private showMessageBanner(level: DevOps.MessageBannerLevel, messageFormat: string, messageLinks?: DevOps.IGlobalMessageLink[]) {
        DevOps.getService("ms.vss-tfs-web.tfs-global-messages-service").then((globalMessagesSvc: DevOps.IGlobalMessagesService) => {
            globalMessagesSvc.setGlobalMessageBanner({
                level: level,
                messageFormat: messageFormat,
                messageLinks: messageLinks || []
            });
        });
    }

    private onURLHashTestClick = (): void => {
        DevOps.getService("ms.vss-features.host-navigation-service").then((navService: DevOps.IHostNavigationService) => {
            var time = new Date().getTime() + "";
            navService.setHash("time=" + time);
            navService.setDocumentTitle("MyHub: " + time);
            navService.getHash().then((hash) => {
                this.showMessageBanner(DevOps.MessageBannerLevel.info, "Got the current {0} value: " + hash, [{ name: "hash", href: "https://www.microsoft.com" }]);
            });

            if (this._dataManager) {
                this._dataManager.setValue("test-id", time).then(() => {
                    this.setState({ extensionData: time });
                });
            }
        });
    }

    private onMessagePromptClick = (): void => {
        DevOps.getService("ms.vss-features.host-dialog-service").then((dialogService: DevOps.IHostDialogService) => {
            dialogService.openMessageDialog("my message dialog", {
                showCancel: true,
                title: "Message dialog",
                onClose: (result) => {
                    this.showMessageBanner(result ? DevOps.MessageBannerLevel.success : DevOps.MessageBannerLevel.error, "Dialog result: " + result);
                }
            });
        });
    }

    private onCustomPromptClick = (): void => {
        DevOps.getService("ms.vss-features.host-dialog-service").then((dialogService: DevOps.IHostDialogService) => {
            dialogService.openCustomDialog<boolean | undefined>(DevOps.getExtensionContext().id + ".panel-content", {
                title: "Custom dialog",
                onClose: (result) => {
                    this.showMessageBanner(result ? DevOps.MessageBannerLevel.success : DevOps.MessageBannerLevel.error, "Custom dialog result: " + result);
                }
            });
        });
    }

    private onPanelClick = (): void => {
        DevOps.getService("ms.vss-features.host-panel-service").then((panelService: DevOps.IHostPanelService) => {
            panelService.openPanel<boolean | undefined>(DevOps.getExtensionContext().id + ".panel-content", {
                title: "My Panel",
                description: "Description of my panel",
                onClose: (result) => {
                    this.showMessageBanner(DevOps.MessageBannerLevel.warning, "Panel result: " + result);
                }
            });
        });
    }
}