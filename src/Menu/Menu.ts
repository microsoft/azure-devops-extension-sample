import "es6-promise/auto";
import * as DevOps from "azure-devops-extension-sdk";

import { getClient } from "azure-devops-extension-api/extension";
import { BuildRestClient } from "azure-devops-extension-api/clients/Build";
import { BuildDefinition } from "azure-devops-extension-api/types/Build";

DevOps.register("sample-build-menu", () => {
    return {
        execute: (context: BuildDefinition) => {

            getClient(BuildRestClient).getDefinition(context.id, context.project.id, undefined, undefined, undefined, true).then(result => {
                DevOps.getService<DevOps.IHostDialogService>(DevOps.CommonServiceIds.HostDialogService).then((dialogSvc) => {
                    dialogSvc.openMessageDialog(`Fetched build definition ${result.name}. Latest build: ${JSON.stringify(result.latestBuild)}`, { showCancel: false });
                });
            });
        }
    }
});

DevOps.init();