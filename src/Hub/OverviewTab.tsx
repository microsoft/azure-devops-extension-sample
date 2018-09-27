import * as React from "react";
import * as DevOps from "azure-devops-extension-sdk";

export interface IOverviewTabState {
    userName?: string;
    projectName?: string;
    iframeUrl?: string;
    extensionData?: string;
}

export class OverviewTab extends React.Component<{}, IOverviewTabState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            iframeUrl: window.location.href
        };
    }

    public componentDidMount() {
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
        });
    }

    public render(): JSX.Element {

        const { userName, projectName, iframeUrl } = this.state;

        return (
            <div className="sample-hub-section">
                <div>Hello, {userName}!</div>
                {
                    projectName &&
                    <div>Project: {projectName}</div>
                }
                <div>iframe URL: {iframeUrl}</div>
            </div>
        );
    }
}