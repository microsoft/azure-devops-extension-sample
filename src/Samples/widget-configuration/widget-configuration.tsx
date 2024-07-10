import "./widget-configuration.scss";
import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import * as Dashboard from "azure-devops-extension-api/Dashboard";
import { TextField } from "azure-devops-ui/TextField";
import { getPipelineDefinition } from "../widget-catalog/utility";
import { Icon } from "azure-devops-ui/Icon";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { showRootComponent } from "../../Common";

interface ISampleWidgetConfigState {
  pipelineId: string;
  pipelineErrorMessage?: string;
  blink: boolean;
}

class SampleWidgetConfig
  extends React.Component<{}, ISampleWidgetConfigState>
  implements Dashboard.IWidgetConfiguration
{
  private widgetConfigurationContext?: Dashboard.IWidgetConfigurationContext;
  private settings: ISampleWidgetSettings = {} as ISampleWidgetSettings;

  componentDidMount() {
    SDK.init().then(() => {
      SDK.register("sample-widget.config", this);
      SDK.resize(400, 200);
    });
  }

  render(): JSX.Element {
    return (
      this.state && (
        <div className="content">
          <div className="config-field">
            <label className="config-field-title">Pipeline ID</label>
            <TextField
              value={this.state.pipelineId}
              onChange={(_e, newValue) => {
                this.updateSettingsAndNotify({ pipelineId: +newValue });
                this.setState({ pipelineId: newValue });
              }}
            />
            {this.state.pipelineErrorMessage && (
              <div className="error-message">
                <Icon className="error-icon" iconName="Error" />
                {this.state.pipelineErrorMessage}
              </div>
            )}
          </div>
          <div className="config-field">
            <Checkbox
              label="Blink"
              checked={this.state.blink}
              onChange={(_e, newValue) => {
                this.updateSettingsAndNotify({ blink: newValue });
                this.setState({ blink: newValue });
              }}
            />
          </div>
        </div>
      )
    );
  }

  // Called in 'onChange' handlers when any field is updated.
  private async updateSettingsAndNotify(
    partialSettings: Partial<ISampleWidgetSettings>
  ) {
    this.settings = { ...this.settings, ...partialSettings };
    // lights up the Save button, and tells the widget about live updates.
    const customSettings = this.serializeWidgetSettings(this.settings);
    await this.widgetConfigurationContext?.notify(
      Dashboard.ConfigurationEvent.ConfigurationChange,
      Dashboard.ConfigurationEvent.Args(customSettings)
    );
  }

  private serializeWidgetSettings(
    settings: ISampleWidgetSettings
  ): Dashboard.CustomSettings {
    return {
      data: JSON.stringify(settings),
      version: { major: 1, minor: 0, patch: 0 },
    };
  }

  private async setStateFromWidgetSettings(
    widgetSettings: Dashboard.WidgetSettings
  ) {
    const deserialized: ISampleWidgetSettings | null = JSON.parse(
      widgetSettings.customSettings.data
    );

    if (deserialized) {
      this.settings = deserialized;
    }

    this.setState({
      pipelineId: deserialized?.pipelineId.toString() ?? "",
      blink: deserialized?.blink ?? false,
    });
  }

  private async validateSettings(): Promise<boolean> {
    let pipelineIdIsValid = false;
    try {
      const pipelineDef = await getPipelineDefinition(this.settings.pipelineId);
      pipelineIdIsValid = !!this.settings.pipelineId && !!pipelineDef;
    } catch {}

    this.setState({
      pipelineErrorMessage: pipelineIdIsValid
        ? ""
        : "A valid pipeline ID is required",
    });

    return pipelineIdIsValid;
  }

  async load(widgetSettings: Dashboard.WidgetSettings, widgetConfigurationContext: Dashboard.IWidgetConfigurationContext ): Promise<Dashboard.WidgetStatus> {
    // capture context so we can notify in updateStateAndNotify
    this.widgetConfigurationContext = widgetConfigurationContext;

    await this.setStateFromWidgetSettings(widgetSettings);
    return Dashboard.WidgetStatusHelper.Success();
  }

  async onSave(): Promise<Dashboard.SaveStatus> {
    // ensure new settings values are valid; set error state for the UI at the same time
    if (!(await this.validateSettings())) {
      return Dashboard.WidgetConfigurationSave.Invalid();
    }
    // persist new settings
    return Dashboard.WidgetConfigurationSave.Valid(
      this.serializeWidgetSettings(this.settings)
    );
  }
}

showRootComponent(<SampleWidgetConfig />);
