import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./query-tabs.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";

class QueryTabGroup extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);        
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
                <Header title="Custom Query Tab" />
                <div className="page-content">
                    <div className="sample-form-section flex-row flex-center">
                        Hello World
                    </div>
                </div>
            </Page>
        );
    }

    private async loadContext(): Promise<void> {
        try {
            console.log("Attempting to get web context...");

            const context = SDK.getWebContext();
            this.setState({ webcontext: context });

            console.log("Context loaded: ", context);

            SDK.notifyLoadSucceeded();
        } catch (error) {
            console.error("Failed to load context: ", error);
        }
    }
}

showRootComponent(<QueryTabGroup />);