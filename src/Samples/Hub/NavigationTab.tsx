import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostNavigationService } from "azure-devops-extension-api";

import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

export interface INavigationTabState {
    currentHash?: string;
}

export class NavigationTab extends React.Component<{}, INavigationTabState> {

    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public render(): JSX.Element {

        const { currentHash } = this.state;

        return (
            <>
                {
                    currentHash &&
                    <div className="sample-hub-section">Current hash: {currentHash}</div>
                }
                <ButtonGroup className="sample-hub-section">
                    <Button text="Get Hash" primary={true} onClick={this.onGetHashClick} />
                    <Button text="Update hash" onClick={this.onUpdateHashClick} />
                    <Button text="Update document title" onClick={this.onUpdateDocumentTitle} />
                </ButtonGroup>
            </>
        );
    }

    private onGetHashClick = async (): Promise<void> => {
        const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
        const hash = await navService.getHash();
        this.setState({ currentHash: hash });
    }

    private onUpdateHashClick = async (): Promise<void> => {
        const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
        navService.setHash("time=" + new Date().getTime());
    }

    private onUpdateDocumentTitle = async (): Promise<void> => {
        const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
        navService.setDocumentTitle("Sample hub new title: " + new Date().getTime());
    }
}