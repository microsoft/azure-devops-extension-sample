import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("sample-backlog-item-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Hello, world");
            console.log(context);
        }
    }
});

SDK.init();