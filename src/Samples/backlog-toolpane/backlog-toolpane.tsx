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
}

class BacklogToolPane extends React.Component<{}, IBacklogToolPane> {
    constructor(props: {}) {
        super(props);  
        this.state = { projectContext: undefined, selectedWorkItems: [] };         
    }

    public componentDidMount() {
        try {   
            
            console.log("Component did mount, register objects...");
            SDK.register("backlogPanelObject", {
                workItemSelectionChanged: (workItemInfos: any) => {
                  console.log("workItemSelectionChanged", workItemInfos);
                  this.setState({ selectedWorkItems: workItemInfos });
                }
            });

            console.log("Initializing SDK...");
            SDK.init();
            
            SDK.ready().then(() => {
                console.log("SDK is ready, loading project context...");
                this.loadProjectContext();                  
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
            <div className="page-content sample-margin">                    
                <div className="webcontext-section">
                    <h2>Project Context:</h2>
                    <pre>{JSON.stringify(this.state.projectContext, null, 2)}</pre>
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
}

showRootComponent(<BacklogToolPane />);