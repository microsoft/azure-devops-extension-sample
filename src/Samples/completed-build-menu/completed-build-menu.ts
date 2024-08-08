import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("completed-build-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom completed build action!");
            console.log(context);
        }
    }
});

SDK.init();