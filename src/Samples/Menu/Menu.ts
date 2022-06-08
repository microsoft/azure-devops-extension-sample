import "es6-promise/auto";

import * as SDK from "azure-devops-extension-sdk";

import {
  BuildDefinition,
  BuildRestClient,
} from "azure-devops-extension-api/Build";
import {
  CommonServiceIds,
  IHostPageLayoutService,
  getClient,
} from "azure-devops-extension-api";

SDK.register("sample-build-menu", () => {
  return {
    /**
     * Based on the target of the menu item, context can contain relevant data from the initial page the menu was accessed from
     *
     * Example: When targeting Azure Repos menu (ms.vss-code-web.source-item-menu), context will contain the following properties:
     *  - gitRepository: The currently selected git repository
     *  - version: The currently selected branch
     */
    execute: async (context: BuildDefinition) => {
      const result = await getClient(BuildRestClient).getDefinition(
        context.project.id,
        context.id,
        undefined,
        undefined,
        undefined,
        true
      );
      const dialogSvc = await SDK.getService<IHostPageLayoutService>(
        CommonServiceIds.HostPageLayoutService
      );
      dialogSvc.openMessageDialog(
        `Fetched build definition ${
          result.name
        }. Latest build: ${JSON.stringify(result.latestBuild)}`,
        { showCancel: false }
      );
    },
  };
});

SDK.init();
