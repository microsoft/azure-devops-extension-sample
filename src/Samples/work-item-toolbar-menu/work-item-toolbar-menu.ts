import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("work-item-toolbar-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom work item toolbar action!");
            console.log(context);
        }
    }
});

SDK.init();