import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IGlobalMessagesService, MessageBannerLevel } from "azure-devops-extension-api";

import { Button } from "azure-devops-ui/Button";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";

export interface IMessagesTabState {
    messageLevel?: MessageBannerLevel;
    selection: ListSelection;
}

export class MessagesTab extends React.Component<{}, IMessagesTabState> {

    constructor(props: {}) {
        super(props);

        const selection = new ListSelection();
        selection.select(0, 1);

        this.state = {
            messageLevel: MessageBannerLevel.info,
            selection
        };
    }

    public render(): JSX.Element {

        return (
            <div className="sample-hub-section flex-row flex-center">
                <label htmlFor="message-level-picker">Message level: </label>
                <Dropdown<MessageBannerLevel>
                    className="sample-picker"
                    listBoxProps={{
                        items: [
                            { id: "info", data: MessageBannerLevel.info, text: "Info"},
                            { id: "error", data: MessageBannerLevel.error, text: "Error"},
                            { id: "Warning", data: MessageBannerLevel.warning, text: "Warning"},
                            { id: "Success", data: MessageBannerLevel.success, text: "Success"}
                        ],
                        onSelect: this.onMessageLevelChanged,
                        selection: this.state.selection
                    }}
                />
                <Button className="sample-button sample-button-left-margin" onClick={this.showMessageBanner} text="Show banner" />
            </div>
        );
    }

    private onMessageLevelChanged = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<MessageBannerLevel>): void => {
        this.setState({ messageLevel: item.data });
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