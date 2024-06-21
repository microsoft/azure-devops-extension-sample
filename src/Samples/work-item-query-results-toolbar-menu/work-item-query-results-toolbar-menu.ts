import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("work-item-query-results-toolbar-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom query results toolbar action!");
            console.log(context);
        }
    }
});

SDK.init();