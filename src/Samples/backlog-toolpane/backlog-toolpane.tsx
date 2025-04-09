import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./backlog-toolpane.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";
import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";


interface IBacklogToolPane {
    projectContext: any;
    selectedWorkItems: any[];
    teamContext: any;
}

class BacklogToolPane extends React.Component<{}, IBacklogToolPane> {
    constructor(props: {}) {
        super(props);
        this.state = { projectContext: undefined, selectedWorkItems: [], teamContext: undefined };
    }

    public componentDidMount() {
        try {

            console.log("Component did mount, register objects...");
            console.log("Initializing SDK...");
            SDK.init();

            SDK.ready().then(() => {
                console.log(SDK.getContributionId());
                console.log("SDK is ready, loading project context...");
                this.loadProjectContext();
                this.loadTeamContext();
            }).catch((error) => {
                console.error("SDK ready failed: ", error);
            });

            SDK.register("backlogPanelObject", () =>  {
                return {
                    workItemSelectionChanged: (workItems:any) => {
                        this.setState({ selectedWorkItems: workItems });
                    }
                }
            });

        } catch (error) {
            console.error("Error during SDK initialization or project context loading: ", error);
        }
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Backlog Toolpane" />
                <div className="page-content sample-margin">
                    <div className="webcontext-section">
                        <h2>Project Context:</h2>
                        <pre>{JSON.stringify(this.state.projectContext, null, 2)}</pre>
                    </div>
                    <div>
                        <h2>Team Context:</h2>
                        <pre>{JSON.stringify(this.state.teamContext, null, 2)}</pre>
                    </div>
                    <div>
                        <h2>Selected Work Items:</h2>
                        <pre>{JSON.stringify(this.state.selectedWorkItems, null, 2)}</pre>
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

    private async loadTeamContext(): Promise<void> {
        try {
            const teamContext = SDK.getConfiguration().team;
            this.setState({ teamContext: teamContext });
        }
        catch (error) {
            console.error("Failed to get team context: ", error);
        }
    }
}

showRootComponent(<BacklogToolPane />);