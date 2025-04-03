import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("sprint-board-pivot-filter-menu", () => {
    return {
        execute: async (context: any) => {
            const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            dialogService.openPanel(SDK.getExtensionContext().id + ".panel-content", {
                title: "Sprint Board Pivot Filter Menu Panel",
                description: "Sprint- and project context",
                configuration: {
                    context: context // pass the context to the panel
                },
            });
        }
    }
});

SDK.init();