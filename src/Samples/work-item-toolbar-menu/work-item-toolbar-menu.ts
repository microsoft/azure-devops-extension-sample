import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("work-item-toolbar-menu", () => {
    return {
        execute: async (context: any) => {
            const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            dialogService.openCustomDialog(SDK.getExtensionContext().id + ".panel-content", {
                title: "Work Item Toolbar Menu Modal",
                configuration: {
                    context: context,
                }
            })
            console.log(context);
        }
    }
});

SDK.init();