import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("query-result-work-item-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom query result menu item!");
            console.log(context);
        }
    }
});

SDK.init();