import "./Pivot.scss";

import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { showRootComponent } from "../../Common";

import { getClient } from "azure-devops-extension-api/extensions/Client";
import { CoreRestClient } from "azure-devops-extension-api/clients/Core";
import { ProjectVisibility, TeamProjectReference } from "azure-devops-extension-api/types/Core";

import { VssDetailsList } from "vss-ui/VssDetailsList";
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";

interface IPivotContentState {
    projects?: TeamProjectReference[];
    columns: IColumn[];
}

class PivotContent extends React.Component<{}, IPivotContentState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            columns: [{
                key: "name",
                fieldName: "name",
                name: "Project",
                onRender: (item: TeamProjectReference) => <span>{item.name}</span>,
                minWidth: 150,
                maxWidth: 200,
                isResizable: true
            },
            {
                key: "description",
                fieldName: "description",
                name: "Description",
                onRender: (item: TeamProjectReference) => <span>{item.description}</span>,
                minWidth: 300,
                isResizable: true
            },
            {
                key: "visibility",
                fieldName: "visibility",
                name: "Visibility",
                onRender: (item: TeamProjectReference) => {
                    return <span>{item.visibility === ProjectVisibility.Public ? "public" : "private"}</span>;
                },
                minWidth: 150,
                isResizable: true
            }]
        };
    }

    public componentDidMount() {
        SDK.init();
        this.initializeComponent();
    }

    private async initializeComponent() {
        const projects = await getClient(CoreRestClient).getProjects();
        this.setState({ projects });
    }

    public render(): JSX.Element {
        return (
            <div className="sample-pivot">
                {
                    !this.state.projects &&
                    <p>Loading...</p>
                }
                {
                    this.state.projects &&
                    <VssDetailsList
                        items={this.state.projects}
                        columns={this.state.columns}
                    />
                }
            </div>
        );
    }
}

showRootComponent(<PivotContent />);