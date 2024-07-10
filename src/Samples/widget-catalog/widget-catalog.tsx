import "./widget-catalog.scss";
import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import * as Dashboard from "azure-devops-extension-api/Dashboard";
import { BuildResult } from "azure-devops-extension-api/Build";
import { getLastestBuild } from "./utility";
import { css } from "azure-devops-ui/Util";
import { showRootComponent } from "../../Common";

interface ISampleWidgetState {
  title: string;
  pipelineStatus: string;
  blink: boolean;
}

class SampleWidget extends React.Component<{}, ISampleWidgetState> implements Dashboard.IConfigurableWidget {
  
  componentDidMount() {
    SDK.init().then(() => {
      SDK.register("sample-widget", this);
    });
  }

  render(): JSX.Element {
    return (
      this.state && (
        <div className="content">
          <h2 className="title">{this.state.title}</h2>
          <div
            className={css("status", this.state.blink ? "blink" : undefined)}
          >
            {this.state.pipelineStatus}
          </div>
        </div>
      )
    );
  }

  async preload(_widgetSettings: Dashboard.WidgetSettings) {
    return Dashboard.WidgetStatusHelper.Success();
  }

  async load(widgetSettings: Dashboard.WidgetSettings): Promise<Dashboard.WidgetStatus> {
    try {
      await this.setStateFromWidgetSettings(widgetSettings);
      return Dashboard.WidgetStatusHelper.Success();
    } catch (e) {
      return Dashboard.WidgetStatusHelper.Failure((e as any).toString());
    }
  }

  async reload(widgetSettings: Dashboard.WidgetSettings): Promise<Dashboard.WidgetStatus> {
    try {
      await this.setStateFromWidgetSettings(widgetSettings);
      return Dashboard.WidgetStatusHelper.Success();
    } catch (e) {
      return Dashboard.WidgetStatusHelper.Failure((e as any).toString());
    }
  }

  private async setStateFromWidgetSettings(widgetSettings: Dashboard.WidgetSettings) {
    this.setState({
      title: widgetSettings.name,
    });

    try {
      const deserialized: ISampleWidgetSettings | null = JSON.parse(widgetSettings.customSettings.data);

      if (deserialized) {
        const latestResult = (await getLastestBuild(deserialized.pipelineId))?.result;

        if (latestResult) {
          this.setState({
            pipelineStatus:
              latestResult == BuildResult.Succeeded ||
                latestResult == BuildResult.PartiallySucceeded
                ? "👍"
                : "👎",
            blink: deserialized.blink,
          });
          return;
        }
      }
    } catch { }
    this.setState({ pipelineStatus: "🤷‍♂️", });
  }
}

showRootComponent(<SampleWidget />);
