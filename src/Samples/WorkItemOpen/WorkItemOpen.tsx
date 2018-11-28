import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./WorkItemOpen.scss";

import { Button } from "azure-devops-ui/Button";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { PickListDropdown } from "azure-devops-ui/PickList";
import { TextField } from "azure-devops-ui/TextField";

import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { showRootComponent } from "../../Common";

class WorkItemOpenContent extends React.Component<{}, {}> {

    private workItemIdValue = new ObservableValue("1");
    private workItemTypeValue = new ObservableValue("Bug");

    public componentDidMount() {
        SDK.init();
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Work Item Open Sample" />
                <div className="page-content">
                    <div className="sample-form-section flex-row flex-center">
                        <TextField className="sample-work-item-id-input" label="Existing work item id" value={this.workItemIdValue} onChange={(ev, newValue) => { this.workItemIdValue.value = newValue; }} />
                        <Button className="sample-work-item-button" text="Open..." onClick={() => this.onOpenExistingWorkItemClick()} />
                    </div>
                    <div className="sample-form-section flex-row flex-center">
                        <div className="flex-column">
                            <label htmlFor="work-item-type-picker">New work item type:</label>
                            <PickListDropdown
                                id="work-item-type-picker"
                                className="sample-work-item-type-picker"
                                initiallySelectedItems={[ this.workItemTypeValue.value ]}
                                getPickListItems={() => this.getWorkItemTypes()}
                                onSelectionChanged={(selection) => { this.workItemTypeValue.value = selection.selectedItems[0] }}
                            />
                        </div>
                        <Button className="sample-work-item-button" text="New..." onClick={() => this.onOpenNewWorkItemClick()} />
                    </div>
                </div>
            </Page>
        );
    }

    private async getWorkItemTypes(): Promise<string[]> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        if (!project) {
            return [ "Bug" ];
        }

        const client = getClient(WorkItemTrackingRestClient);
        return client.getWorkItemTypes(project.name).then(types => {
            const typeNames = types.map(t => t.name);
            typeNames.sort((a, b) => localeIgnoreCaseComparer(a, b));
            return typeNames;
        });
    }

    private async onOpenExistingWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(this.workItemIdValue.value));
    };

    private async onOpenNewWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openNewWorkItem(this.workItemTypeValue.value, { 
            Title: "Opened a work item from the Work Item Nav Service",
            Tags: "extension;wit-service",
            priority: 1,
            "System.AssignedTo": SDK.getUser().name,
         });
    };
}

showRootComponent(<WorkItemOpenContent />);