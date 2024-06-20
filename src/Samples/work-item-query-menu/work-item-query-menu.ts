import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("work-item-query-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom work item query menu!");
            console.log(context);
        }
    }
});

SDK.init();