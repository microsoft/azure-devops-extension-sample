import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { ObservableValue, ObservableArray } from "azure-devops-ui/Core/Observable";

const tabName = new ObservableValue("Tab A");
const badgeCount = new ObservableValue<number>(0);
const tabs = new ObservableArray([
    {
        badgeCount,
        id: "my-dynamic-tab",
        name: tabName,
        order: 5000000
    }
]);

const tabNames = ["Tab A", "Tab B", "Tab C", "Tab D"];
const badgeCounts = [0, 21, 1522, 9999];
let tabIndex = 0;

window.setInterval(() => {
    const index = ++tabIndex % tabNames.length;
    tabName.value = tabNames[index];
    badgeCount.value = badgeCounts[index];
}, 2000);

SDK.register("ms-samples.samples.dynamic-tab-provider", () => {
    return {
        getTabs: (tabGroupId: string, contextualData: any) => {
            return tabs;
        }
    }
});

SDK.init();