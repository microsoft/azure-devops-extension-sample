import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("query-result-work-item-menu", () => {
    return {
            execute: async (context: any) => {
                const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
                dialogService.openPanel(SDK.getExtensionContext().id + ".panel-content", {
                    title: "Query Result Work Item Menu Panel",
                    description: "Project-and Queries context",
                    configuration: {
                        context: context,
                    }
                })
                console.log(context);
            }
        }
});

SDK.init();