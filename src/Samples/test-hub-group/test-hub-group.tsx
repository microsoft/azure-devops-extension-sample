import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./test-hub-group.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";

class WorkHubGroup extends React.Component<{}, {}> {   

    constructor(props: {}) {
        super(props);
    }

    public componentDidMount() {
        SDK.init();        
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Custom Work Hub" />
                <div className="page-content">
                    <div className="sample-form-section flex-row flex-center">
                        Hello World
                    </div>                   
                </div>
            </Page>
        );
    }   
}

showRootComponent(<WorkHubGroup />);