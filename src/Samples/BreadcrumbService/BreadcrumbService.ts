import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";

SDK.register("sample-breadcrumb-service", () => {
    return {
        subscribe : () => {},
        value: [{"key": "sample-breadcrumb", "text": "Sample Breadcrumb Item", "href": ".", "rank": 1000}]
    }
});

SDK.init();