import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./modal-dialog.scss";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import { Button } from "azure-devops-ui/Button";

interface IModalDialog {
    inputValue: string;
    config: any;
}

class ModalDialog extends React.Component<{}, IModalDialog> {

    constructor(props: {}) {
        super(props);
        this.state = { inputValue: "", config: null };
    }

    public componentDidMount() {
        try {
            console.log("Component did mount, initializing SDK...");
            SDK.init();

            SDK.ready().then(() => {
                console.log("SDK is ready, loading project config...");
                this.setState({ config: SDK.getConfiguration() });
                this.setState({ inputValue: this.state.config.inputValue });
            }).catch((error) => {
                console.error("SDK ready failed: ", error);
            });
        } catch (error) {
            console.error("Error during SDK initialization", error);
        }
    }

    public clearInputValue = () => {
        this.setState({ inputValue: "" });
        if (this.state.config) {
            this.state.config.clearInputValue();
        }
    };

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <div className="page-content">
                    <h3>Input value is: {this.state.inputValue}</h3>
                    <div className="webcontext-section">
                        <ButtonGroup>
                            <Button
                                text="Clear input value"
                                danger={true}
                                onClick={() => this.clearInputValue()}
                            />
                        </ButtonGroup>
                    </div>
                </div>
            </Page>
        );
    }

}

showRootComponent(<ModalDialog />);