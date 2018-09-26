import * as React from "react";
import * as DevOps from "azure-devops-extension-sdk";

import { Button } from "vss-ui/Button";
import { PickListDropdown } from "vss-ui/PickList";
import { IHeaderCommandBarItem, Page, Header, TitleSize } from "vss-ui/Page";

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

            const userName = DevOps.getUser().displayName;
            this.setState({ userName });

            DevOps.getService<DevOps.IProjectPageService>(DevOps.CommonServiceIds.ProjectPageService).then((projectService) => {
                projectService.getProject().then((project) => {
                    if (project) {
                        this.setState({ projectName: project.name });
                    }
                });
            });

            DevOps.getAccessToken().then((accessToken) => {
                DevOps.getService<DevOps.IExtensionDataService>(DevOps.CommonServiceIds.ExtensionDataService).then((extDataService) => {
                    extDataService.getExtensionDataManager(DevOps.getExtensionContext().id, accessToken).then((dataMgr) => {
                        this._dataManager = dataMgr;
                        this._dataManager.getValue<string>("test-id").then((data) => {
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
            <Page className="simple-page">

                <Header title="Sample Page"
                    commandBarItems={this.getCommandBarItems()}
                    titleSize={TitleSize.Medium} />

                <div className="page-content">
                    <h1>Hello, {userName}!</h1>
                    {
                        projectName &&
                        <h2>Project: {projectName}</h2>
                    }
                    
                    <h2>iframe URL: {iframeUrl}</h2>
                
                    <Button onClick={this.onURLHashTestClick} text="URL hash test" />
                    
                    <PickListDropdown initiallySelectedItems={['Option 1']} getPickListItems={() => { return ['Option 1', 'Option 2', 'Option 3'] }} />

                    {
                        extensionData &&
                        <h3>Extension data: {extensionData}</h3>
                    }
                </div>
            </Page>
        );
    }

    private getCommandBarItems(): IHeaderCommandBarItem[] {
        return [
            {
              key: "panel",
              name: "Panel",
              onClick: this.onPanelClick,
              iconProps: {
                iconName: 'Add'
              },
              isPrimary: true,
              tooltipProps: {
                content: "Open a panel with custom extension content"
              }
            },
            {
              key: "messageDialog",
              name: "Message",
              onClick: this.onMessagePromptClick,
              tooltipProps: {
                content: "Open a simple message dialog"
              }
            },
            {
              key: "customDialog",
              name: "Custom Dialog",
              onClick: this.onCustomPromptClick,
              tooltipProps: {
                content: "Open a dialog with custom extension content"
              }
            }
        ];
    }

    private showMessageBanner(level: DevOps.MessageBannerLevel, messageFormat: string, messageLinks?: DevOps.IGlobalMessageLink[]) {
        DevOps.getService<DevOps.IGlobalMessagesService>(DevOps.CommonServiceIds.GlobalMessagesService).then((globalMessagesSvc) => {
            globalMessagesSvc.setGlobalMessageBanner({
                level: level,
                messageFormat: messageFormat,
                messageLinks: messageLinks || []
            });
        });
    }

    private onURLHashTestClick = (): void => {
        DevOps.getService<DevOps.IHostNavigationService>(DevOps.CommonServiceIds.HostNavigationService).then((navService) => {
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
        DevOps.getService<DevOps.IHostDialogService>(DevOps.CommonServiceIds.HostDialogService).then((dialogService) => {
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
        DevOps.getService<DevOps.IHostDialogService>(DevOps.CommonServiceIds.HostDialogService).then((dialogService) => {
            dialogService.openCustomDialog<boolean | undefined>(DevOps.getExtensionContext().id + ".panel-content", {
                title: "Custom dialog",
                onClose: (result) => {
                    this.showMessageBanner(result ? DevOps.MessageBannerLevel.success : DevOps.MessageBannerLevel.error, "Custom dialog result: " + result);
                }
            });
        });
    }

    private onPanelClick = (): void => {
        DevOps.getService<DevOps.IHostPanelService>(DevOps.CommonServiceIds.HostPanelService).then((panelService) => {
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