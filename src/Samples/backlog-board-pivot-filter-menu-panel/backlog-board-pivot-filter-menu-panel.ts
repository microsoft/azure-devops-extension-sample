import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("backlog-board-pivot-filter-menu-panel", () => {
    return {
        execute: async (context: any) => {
            const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            dialogService.openPanel(SDK.getExtensionContext().id + ".panel-content", {
                title: "Backlog Panel",
                description: "Team- and project context",
                configuration: {
                    context: context // pass the context to the panel
                },
            });
        }
    }
});

SDK.init();