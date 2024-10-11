import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("git-commit-list-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom Action!");
            console.log(context);
        }
    }
});

SDK.init();