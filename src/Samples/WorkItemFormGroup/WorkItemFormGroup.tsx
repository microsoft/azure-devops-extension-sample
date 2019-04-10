import {
  IWorkItemFormService,
  WorkItemTrackingServiceIds
} from "azure-devops-extension-api/WorkItemTracking";
import * as SDK from "azure-devops-extension-sdk";
import { Button } from "azure-devops-ui/Button";
import * as React from "react";
import { showRootComponent } from "../../Common";
import { Header } from "azure-devops-ui/Header";

interface WorkItemFormGroupComponentState {
  eventContent: string;
}

interface IWorkItemChangedArgs {
  /**
   * Id of the work item.
   */
  id: number;
}

/**
 * Interface defining the arguments for the 'onLoaded' notification sent by the ActiveWorkItemService
 */
interface IWorkItemLoadedArgs extends IWorkItemChangedArgs {
  /**
   * 'true' if the work item is a 'new', unsaved work item, 'false' otherwise.
   */
  isNew: boolean;
  /**
   * 'true' write rest apis are disabled. All controls should be rendered as readonly
   */
  isReadOnly: boolean;
}

/**
 * Interface defining the arguments for the 'onFieldChanged' notification sent by the ActiveWorkItemService
 */
interface IWorkItemFieldChangedArgs extends IWorkItemChangedArgs {
  /**
   * Set of fields that have been changed.  'key' is the field reference name.
   */
  changedFields: { [key: string]: any };
}

class WorkItemFormGroupComponent extends React.Component<{},  WorkItemFormGroupComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      eventContent: ""
    };
  }

  public componentDidMount() {
    SDK.init().then(() => {
      this.registerEvents();
    });
  }

  public render(): JSX.Element {
    return (
      <div>
        <Header title={"Sample group extension"} />
        <Button
          className="sample-work-item-button"
          text="Click me to change title!"
          onClick={() => this.onClick()}
        />
        <div className="sample-work-item-events">{this.state.eventContent}</div>
      </div>
    );
  }

  private registerEvents() {
    SDK.register(SDK.getContributionId(), () => {
      return {
        // Called when the active work item is modified
        onFieldChanged: (args: IWorkItemFieldChangedArgs) => {
          this.setState({
            eventContent: `onFieldChanged - ${JSON.stringify(args)}`
          });
        },

        // Called when a new work item is being loaded in the UI
        onLoaded: (args: IWorkItemLoadedArgs) => {
          this.setState({
            eventContent: `onLoaded - ${JSON.stringify(args)}`
          });
        },

        // Called when the active work item is being unloaded in the UI
        onUnloaded: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onUnloaded - ${JSON.stringify(args)}`
          });
        },

        // Called after the work item has been saved
        onSaved: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onSaved - ${JSON.stringify(args)}`
          });
        },

        // Called when the work item is reset to its unmodified state (undo)
        onReset: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onReset - ${JSON.stringify(args)}`
          });
        },

        // Called when the work item has been refreshed from the server
        onRefreshed: (args: IWorkItemChangedArgs) => {
          this.setState({
            eventContent: `onRefreshed - ${JSON.stringify(args)}`
          });
        }
      };
    });
  }

  private async onClick() {
    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );
    workItemFormService.setFieldValue(
      "System.Title",
      "Title set from your group extension!"
    );
  }
}

showRootComponent(<WorkItemFormGroupComponent />);
