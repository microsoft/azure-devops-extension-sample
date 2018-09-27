import * as React from "react";
import * as DevOps from "azure-devops-extension-sdk";

import { Button } from "vss-ui/Button";

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
                <div className="sample-hub-section">
                    <Button className="sample-button" text="Get Hash" primary={true} onClick={this.onGetHashClick} />
                    <Button className="sample-button sample-button-left-margin" text="Update hash" onClick={this.onUpdateHashClick} />
                    <Button className="sample-button sample-button-left-margin" text="Update document title" onClick={this.onUpdateDocumentTitle} />
                </div>
            </>
        );
    }

    private onGetHashClick = (): void => {
        DevOps.getService<DevOps.IHostNavigationService>(DevOps.CommonServiceIds.HostNavigationService).then((navService) => {
            navService.getHash().then((hash) => {
                this.setState({ currentHash: hash });
            });
        });
    }

    private onUpdateHashClick = (): void => {
        DevOps.getService<DevOps.IHostNavigationService>(DevOps.CommonServiceIds.HostNavigationService).then((navService) => {
            var time = new Date().getTime() + "";
            navService.setHash("time=" + time);
        });
    }

    private onUpdateDocumentTitle = (): void => {
        DevOps.getService<DevOps.IHostNavigationService>(DevOps.CommonServiceIds.HostNavigationService).then((navService) => {
            var time = new Date().getTime() + "";
            navService.setDocumentTitle("Sample hub new title: " + time);
        });
    }
}