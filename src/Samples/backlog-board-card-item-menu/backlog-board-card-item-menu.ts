import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("backlog-board-card-item-menu", () => {
    return {
        execute: async (context: any) => {
            alert("Custom card menu action!");
            console.log(context);
        }
    }
});

SDK.init();