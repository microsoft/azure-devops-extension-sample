import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./build-release-hub-group.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";

class BuildHubGroup extends React.Component<{}, {}> {   

    constructor(props: {}) {
        super(props);
    }

    public componentDidMount() {
        SDK.init();        
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Custom Build Hub" />
                <div className="page-content">
                    <div className="sample-form-section flex-row flex-center">
                        Hello World
                    </div>                   
                </div>
            </Page>
        );
    }   
}

showRootComponent(<BuildHubGroup />);