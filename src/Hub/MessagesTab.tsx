import * as React from "react";
import * as DevOps from "azure-devops-extension-sdk";

import { Button } from "vss-ui/Button";
import { IPickListSelection, PickListDropdown } from "vss-ui/PickList";

export interface IMessagesTabState {
    messageLevel?: DevOps.MessageBannerLevel;
}

export class MessagesTab extends React.Component<{}, IMessagesTabState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            messageLevel: DevOps.MessageBannerLevel.info
        };
    }

    public render(): JSX.Element {

        return (
            <div className="sample-hub-section flex-row flex-center">
                <label htmlFor="message-level-picker">Message level: </label>
                <PickListDropdown
                    id="message-level-picker"
                    className="sample-picker"
                    initiallySelectedItems={[{ value: DevOps.MessageBannerLevel.info, name: "Info"}]}
                    getPickListItems={() => {
                        return [
                            { value: DevOps.MessageBannerLevel.info, name: "Info"},
                            { value: DevOps.MessageBannerLevel.error, name: "Error"},
                            { value: DevOps.MessageBannerLevel.warning, name: "Warning"},
                            { value: DevOps.MessageBannerLevel.success, name: "Success"}
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

    private showMessageBanner = (): void => {

        const { messageLevel } = this.state;

        DevOps.getService<DevOps.IGlobalMessagesService>(DevOps.CommonServiceIds.GlobalMessagesService).then((globalMessagesSvc) => {
            globalMessagesSvc.setGlobalMessageBanner({
                level: messageLevel,
                messageFormat: "This is a message from the sample extension. {0}",
                messageLinks: [{
                    name: "Learn more",
                    href: "https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node"
                }]
            });
        });
    }
}