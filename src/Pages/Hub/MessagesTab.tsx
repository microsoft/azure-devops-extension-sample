import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IGlobalMessagesService, MessageBannerLevel } from "azure-devops-extension-api";

import { Button } from "azure-devops-ui/Button";
import { IPickListSelection, PickListDropdown } from "azure-devops-ui/PickList";

export interface IMessagesTabState {
    messageLevel?: MessageBannerLevel;
}

export class MessagesTab extends React.Component<{}, IMessagesTabState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            messageLevel: MessageBannerLevel.info
        };
    }

    public render(): JSX.Element {

        return (
            <div className="sample-hub-section flex-row flex-center">
                <label htmlFor="message-level-picker">Message level: </label>
                <PickListDropdown
                    id="message-level-picker"
                    className="sample-picker"
                    initiallySelectedItems={[{ value: MessageBannerLevel.info, name: "Info"}]}
                    getPickListItems={() => {
                        return [
                            { value: MessageBannerLevel.info, name: "Info"},
                            { value: MessageBannerLevel.error, name: "Error"},
                            { value: MessageBannerLevel.warning, name: "Warning"},
                            { value: MessageBannerLevel.success, name: "Success"}
                        ]
                    }}
                    getListItem={(item) => {
                        return {
                            name: item.name,
                            key: item.name
                        }
                    }}
                    onSelectionChanged={this.onMessageLevelChanged}
                />
                <Button className="sample-button sample-button-left-margin" onClick={this.showMessageBanner} text="Show banner" />
            </div>
        );
    }

    private onMessageLevelChanged = (selection: IPickListSelection): void => {
        if (selection.selectedItems && selection.selectedItems[0]) {
            this.setState({ messageLevel: selection.selectedItems[0].value });
        }
    }

    private showMessageBanner = async (): Promise<void> => {

        const { messageLevel } = this.state;

        const globalMessagesSvc = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
        globalMessagesSvc.setGlobalMessageBanner({
            level: messageLevel,
            messageFormat: "This is a message from the sample extension. {0}",
            messageLinks: [{
                name: "Learn more",
                href: "https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node"
            }]
        });
    }
}