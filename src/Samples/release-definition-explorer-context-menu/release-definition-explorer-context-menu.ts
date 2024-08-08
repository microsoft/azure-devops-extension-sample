import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("release-definition-explorer-context-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom release definition action action!");
            console.log(context);
        }
    }
});

SDK.init();