import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk/SDK";
import { CommonServiceIds, IHostDialogService } from "azure-devops-extension-api/extensions/CommonServices";

import { getClient } from "azure-devops-extension-api/extensions/Client";
import { BuildRestClient } from "azure-devops-extension-api/clients/Build";
import { BuildDefinition } from "azure-devops-extension-api/types/Build";

SDK.register("sample-build-menu", () => {
    return {
        execute: async (context: BuildDefinition) => {

            const result = await getClient(BuildRestClient).getDefinition(context.id, context.project.id, undefined, undefined, undefined, true);
            const dialogSvc = await SDK.getService<IHostDialogService>(CommonServiceIds.HostDialogService);
            dialogSvc.openMessageDialog(`Fetched build definition ${result.name}. Latest build: ${JSON.stringify(result.latestBuild)}`, { showCancel: false });
        }
    }
});

SDK.init();