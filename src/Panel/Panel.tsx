import "./Panel.scss";

import * as React from "react";
import * as DevOps from "azure-devops-extension-sdk";

import { Button } from "vss-ui/Button";
import { Toggle } from "vss-ui/Toggle";
import { showRootComponent } from "../Common";

interface IPanelContentState {
    message?: string;
    toggleValue?: boolean;
    ready?: boolean;
}

class PanelContent extends React.Component<{}, IPanelContentState> {
    
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        DevOps.init({
            applyTheme: true,
            loaded: true
        });

        DevOps.ready(() => {
            const message = DevOps.getConfiguration().message || "Custom dialog message";
            const toggleValue = !!DevOps.getConfiguration().initialValue;
            this.setState({ message, toggleValue, ready: true });
        });
    }

    public render(): JSX.Element {
        const { message, ready, toggleValue } = this.state;

        return (
            <div className="sample-panel flex-column flex-grow">
                <div className="flex-grow">
                    <Toggle checked={toggleValue} text={message} disabled={!ready} onChange={(e, val) => this.setState({toggleValue: val})} />
                </div>
                <div className="sample-panel-button-bar">
                    <Button
                        primary={true}
                        text="OK"
                        onClick={() => this.dismiss(true)}
                    />
                    <Button
                        className="sample-button-left-margin"
                        text="Cancel"
                        onClick={() => this.dismiss(false)}
                    />
                </div>
            </div>
        );
    }

    private dismiss(useValue: boolean) {
        const result = useValue ? this.state.toggleValue : undefined;
        const config = DevOps.getConfiguration();
        if (config.dialog) {
            config.dialog.close(result);
        }
        else if (config.panel) {
            config.panel.close(result);
        }
    }
}

showRootComponent(<PanelContent />);