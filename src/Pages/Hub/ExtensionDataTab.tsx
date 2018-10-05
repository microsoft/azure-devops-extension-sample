import * as React from "react";
import * as SDK from "azure-devops-extension-sdk/SDK";
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from "azure-devops-extension-api/extensions/CommonServices";

import { Button } from "vss-ui/Button";
import { TextField } from "vss-ui/TextField";

export interface IExtensionDataState {
    dataText?: string;
    persistedText?: string;
    ready?: boolean;
}

export class ExtensionDataTab extends React.Component<{}, IExtensionDataState> {

    private _dataManager?: IExtensionDataManager;

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.initializeState();
    }

    private async initializeState(): Promise<void> {
        await SDK.ready();
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        this._dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext()!.id, accessToken);

        this._dataManager.getValue<string>("test-id").then((data) => {
            this.setState({
                dataText: data,
                persistedText: data,
                ready: true
            });
        }, () => {
            this.setState({
                dataText: "",
                ready: true
            });
        });
    }

    public render(): JSX.Element {
        const { dataText, ready, persistedText } = this.state;

        return (
            <div className="sample-hub-section flex-row">
                <TextField
                    value={dataText}
                    onChanged={this.onTextValueChanged}
                    disabled={!ready}
                />
                <Button
                    className="sample-button sample-button-left-margin"
                    text="Save"
                    primary={true}
                    onClick={this.onSaveData}
                    disabled={!ready || dataText === persistedText}
                />
            </div>
        );
    }

    private onTextValueChanged = (newValue: string): void => {
        this.setState({ dataText: newValue });
    }

    private onSaveData = (): void => {
        const { dataText } = this.state;
        this.setState({ ready: false });
        this._dataManager!.setValue<string>("test-id", dataText || "").then(() => {
            this.setState({
                ready: true,
                persistedText: dataText
            });
        });
    }
}