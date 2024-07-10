import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./collection-admin-hub-group.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";
import { CommonServiceIds, ExtensionDataCollection, IHostPageLayoutService } from "azure-devops-extension-api";

interface ICollectionAdminHubGroup {
    hostContext: any;
}

class CollectionAdminHubGroup extends React.Component<{}, ICollectionAdminHubGroup> {   

    constructor(props: {}) {
        super(props);
        this.state = { hostContext: undefined };  
    }

    public componentDidMount() {
        try {        
            console.log("Component did mount, initializing SDK...");
            SDK.init();
            
            SDK.ready().then(() => {
                console.log("SDK is ready, loading context...");
                this.loadContext();
            }).catch((error) => {
                console.error("SDK ready failed: ", error);
            });
        } catch (error) {
            console.error("Error during SDK initialization or context loading: ", error);
        }
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Custom Collection Admin Hub" />
                <div className="page-content">                    
                    <div className="webcontext-section">
                        <h2>Host Context:</h2>
                        <pre>{JSON.stringify(this.state.hostContext, null, 2)}</pre>
                    </div>
                </div>
            </Page>
        );
    }   

    private async loadContext(): Promise<void> {
        try {            
            const host: SDK.IHostContext = await SDK.getHost();
                    

            this.setState({ hostContext: host });            

            SDK.notifyLoadSucceeded();
        } catch (error) {
            console.error("Failed to load context: ", error);
        }
    }
}

showRootComponent(<CollectionAdminHubGroup />);