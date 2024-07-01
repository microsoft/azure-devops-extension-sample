import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("sprint-board-pivot-filter-menu", () => {
    return {
        execute: async (context: any) => {
            alert("sprint board pivot menu!");
            console.log(context);
        }
    }
});

SDK.init();