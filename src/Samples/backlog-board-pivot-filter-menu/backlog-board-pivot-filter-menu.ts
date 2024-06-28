import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("backlog-board-pivot-filter-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom board pivot menu!");
            console.log(context);
        }
    }
});

SDK.init();