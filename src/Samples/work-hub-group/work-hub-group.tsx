import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./work-hub-group.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";
import { CommonServiceIds, IProjectPageService, getClient } from "azure-devops-extension-api";
import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";

interface IWorkHubGroup {
    projectContext: any;
    assignedWorkItems: any[];
}

class WorkHubGroup extends React.Component<{}, IWorkHubGroup> {

    constructor(props: {}) {
        super(props);
        this.state = { projectContext: undefined, assignedWorkItems: [] };
    }

    public componentDidMount() {
        try {
            console.log("Component did mount, initializing SDK...");
            SDK.init();

            SDK.ready().then(() => {
                console.log("SDK is ready, loading project context...");
                this.loadProjectContext();
                this.loadAssignedWorkItems();
            }).catch((error) => {
                console.error("SDK ready failed: ", error);
            });
        } catch (error) {
            console.error("Error during SDK initialization or project context loading: ", error);
        }
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Custom Work Hub" />
                <div className="page-content">
                    <div className="webcontext-section">
                        <h2>Project Context:</h2>
                        <pre>{JSON.stringify(this.state.projectContext, null, 2)}</pre>
                    </div>
                    <div className="webcontext-section">
                        <h2>Work Items Assigned To Me:</h2>
                        <pre>{JSON.stringify(this.state.assignedWorkItems, null, 2)}</pre>
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

    private async loadAssignedWorkItems(): Promise<void> {
        try {
            const client = getClient(WorkItemTrackingRestClient);

            const wiqlQuery = {
                query:`
                    SELECT [System.Id], [System.Title]
                    FROM WorkItems
                    WHERE [System.AssignedTo] = @Me
                    ORDER BY [System.ChangedDate] DESC
                    `
            };

            const queryResult = await client.queryByWiql(wiqlQuery);
            const workItemIds = queryResult.workItems.map((wi) => wi.id);

            if (workItemIds.length > 0) {
                const workItems = await client.getWorkItems(workItemIds);
                this.setState({ assignedWorkItems: workItems });
            }
            else {
                this.setState({ assignedWorkItems: [] });
            }
        } catch (error) {
            console.error("Failed to load assigned work items: ", error);
        }
    }
}

showRootComponent(<WorkHubGroup />);