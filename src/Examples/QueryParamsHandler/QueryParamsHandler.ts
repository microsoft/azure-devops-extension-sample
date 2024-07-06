import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostNavigationService, IHostPageLayoutService } from "azure-devops-extension-api";

SDK.register("QueryParamsService", () => {
    return {
        handleQueryParams: async () => {
            const navService = await SDK.getService<IHostNavigationService>(CommonServiceIds.HostNavigationService);
            const queryParams = await navService.getQueryParams();

            if (queryParams["showMyPanel"] === "true") {

                const title = queryParams["myPanelTitle"] || "My Panel";

                const panelService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
                panelService.openPanel<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
                    title,
                    description: "Description of my panel",
                    configuration: {
                        message: "Panel form item",
                        initialValue: false
                    }
                });
            }
        }
    }
});

SDK.init();