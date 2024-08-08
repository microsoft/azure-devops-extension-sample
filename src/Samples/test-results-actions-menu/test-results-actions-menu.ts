import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("test-results-actions-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom action!");
            console.log(context);
        }
    }
});

SDK.init();