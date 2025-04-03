import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { showRootComponent } from "../../Common";
import { Page } from "azure-devops-ui/Page";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";

interface IPanelContent {
    configuration: any;
    projectContext: any;
}

class PanelContent extends React.Component<{}, IPanelContent> {

    constructor(props: {}) {
        super(props);
        this.state = { configuration: undefined, projectContext: undefined };
    }

    public componentDidMount() {
        try {
            console.log("Component did mount, initializing SDK...");
            SDK.init();

            SDK.ready().then(() => {
                console.log("SDK is ready, loading project config...");
                this.setState({ configuration: SDK.getConfiguration() });
                this.loadProjectContext();
                SDK.resize(400, 600);
            }).catch((error) => {
                console.error("SDK ready failed: ", error);
            });
        } catch (error) {
            console.error("Error during SDK initialization", error);
        }
    }

    public render(): JSX.Element {
        return (
            <Page>
                <div>
                    <div>
                        <h2>Extension Context:</h2>
                        <pre>{JSON.stringify(this.state.configuration, null, 2)}</pre>
                    </div>
                    <div>
                        <h2>Project Context:</h2>
                        <pre>{JSON.stringify(this.state.projectContext, null, 2)}</pre>
                    </div>
                </div>
            </Page>
        );
    }

    private async loadProjectContext(): Promise<void> {
        try {
            const client = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
            const context = await client.getProject();

            this.setState({ projectContext: context });

            SDK.notifyLoadSucceeded();
        } catch (error) {
            console.error("Failed to load project context: ", error);
        }
    }

}

showRootComponent(<PanelContent />);