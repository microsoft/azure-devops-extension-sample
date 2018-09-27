import "es6-promise/auto";
import * as DevOps from "azure-devops-extension-sdk";

DevOps.register("sample-build-menu", () => {
    return {
        execute: (context: any) => {
            DevOps.getService<DevOps.IHostDialogService>(DevOps.CommonServiceIds.HostDialogService).then((dialogSvc) => {
                dialogSvc.openMessageDialog("Custom message from extension. Context: " + JSON.stringify(context), { showCancel: false });
            });
        }
    }
});

DevOps.init({ loaded: true });