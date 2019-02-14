import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IHostPageLayoutService } from "azure-devops-extension-api";
import { BuildDefinition, BuildRestClient } from "azure-devops-extension-api/Build";

SDK.register("project-custom-command", () => {
    return {
        execute: async (context: BuildDefinition) => {
            const panelService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
            panelService.openPanel<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
                title: "My Custom Panel",
                description: "Panel invoked from projects tab",
                configuration: {
                    message: "Custom option"
                }
            });
        }
    }
});

SDK.init();