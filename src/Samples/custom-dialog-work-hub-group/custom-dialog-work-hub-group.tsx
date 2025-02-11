import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./custom-dialog-work-hub-group.scss";

import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";

import { showRootComponent } from "../../Common";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";
import { Button } from "azure-devops-ui/Button";
import { TextField } from "azure-devops-ui/TextField";

interface ICustomDialogWorkHubGroup {
    inputValue: string;
}

class CustomDialogWorkHubGroup extends React.Component<{}, ICustomDialogWorkHubGroup> {

    constructor(props: {}) {
        super(props);
        this.state = { inputValue: "" };
    }

    public componentDidMount() {
        try {
            console.log("Component did mount, initializing SDK...");
            SDK.init();

            SDK.ready().then(() => {
                console.log("SDK is ready");
            }).catch((error) => {
                console.error("SDK ready failed: ", error);
            });
        } catch (error) {
            console.error("Error during SDK initialization", error);
        }
    }

    public openDialog = async () => {
        const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
        dialogService.openCustomDialog<boolean | undefined>(SDK.getExtensionContext().id + ".modal-dialog", { //Ensure this matches the id of the contibution of the modal content
          title: "Custom Modal Dialog",
          lightDismiss: true,
          configuration: {
            inputValue: this.state.inputValue,
            clearInputValue: () => this.setState({ inputValue: "" }),
          },
        });
    };

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Custom Dialog Work Hub" />
                <div className="page-content">
                    <div className="webcontext-section">
                        <h2>Text to be displayed in the modal</h2>
                        <TextField
                        value={this.state.inputValue}
                        onChange={(e, newValue) => this.setState({ inputValue: newValue || ""})}
                        placeholder="Enter a value to be displayed in the Modal"
                        />
                        <Button primary={true} onClick={this.openDialog}>Open Dialog</Button>
                    </div>
                </div>
            </Page>
        );
    }


}

showRootComponent(<CustomDialogWorkHubGroup />);