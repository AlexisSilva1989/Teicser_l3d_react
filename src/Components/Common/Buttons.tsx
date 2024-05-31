import React from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { useFullLocation } from "../../Common/Hooks/useFullLocation";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { $j } from "../../Common/Utils/Reimports";

interface IPathState {
  path: string;
  state?: any;
}

interface IButtonProps {
  label?: string;
  icon?: string;
  className?: string;
  path?: IPathState | string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  iconLoading?: string;
}

export const Buttons = {
  Common: (props: IButtonProps) => {
    const { history, location } = useFullLocation();
    const { localize, capitalize: caps } = useFullIntl();
    function onClick() {
      if (props.path == null) {
        return;
      }
      if (typeof props.path === "string") {
        history.push($j(location.pathname, localize(props.path)));
        return;
      }
      history.push(
        $j(location.pathname, localize(props.path.path)),
        props.path.state
      );
    }
    return (
      <button
        type={props.type}
        className={"btn " + props.className}
        onClick={props.path == null ? props.onClick : onClick}
        disabled={props.disabled}
      >
        {props.icon !== "" && <i className={"mr-3 " + props.icon} />}
        {props.label ? caps(props.label) : ""}
      </button>
    );
  },
  Add: (
    props: Pick<
      IButtonProps,
      "label" | "path" | "disabled" | "className" | "onClick"
    >
  ) => (
    <Buttons.Common
      label={props.label ?? "labels:links.add"}
      icon="fas fa-plus"
      path={props.path}
      className={"btn-primary " + (props.className ?? "")}
      disabled={props.disabled}
      onClick={props.onClick}
      type="button"
    />
  ),
  Save: (
    props: Pick<IButtonProps, "path" | "onClick" | "disabled" | "className">
  ) => {
    const history = useHistory();
    return (
      <Buttons.Common
        label="labels:links.save"
        icon="fas fa-save"
        path={props.path}
        disabled={props.disabled}
        onClick={props.path ? undefined : props.onClick ?? history.goBack}
        className={"btn-primary " + (props.className ?? "")}
      />
    );
  },
  Back: (props: Pick<IButtonProps, "onClick" | "disabled" | "className">) => {
    const history = useHistory();
    return (
      <Buttons.Common
        label="labels:links.go_back"
        icon="fas fa-arrow-left"
        disabled={props.disabled}
        onClick={props.onClick ?? history.goBack}
        className={"btn-outline-primary " + (props.className ?? "")}
      />
    );
  },
  Void: (
    props: Pick<IButtonProps, "onClick" | "type" | "disabled" | "className">
  ) => (
    <Buttons.Common
      label="labels:links.void"
      icon="fas fa-times"
      onClick={props.onClick}
      className={"btn-outline-warning " + (props.className ?? "")}
      type={props.type}
      disabled={props.disabled}
    />
  ),
  Submit: (
    props: Pick<
      IButtonProps,
      "label" | "icon" | "className" | "disabled" | "onClick" | "type"
    >
  ) => {
    const { capitalize: caps } = useFullIntl();
    return (
      <button
        type={props.type ?? "submit"}
        onClick={props.onClick}
        className={"btn btn-primary " + (props.className ?? "")}
        disabled={props.disabled}
      >
        {props.icon !== "" && <i className={"mr-3 " + props.icon} />}
        {props.label ? caps(props.label) : ""}
      </button>
    );
  },
  Delete: (
    props: Pick<IButtonProps, "path" | "disabled" | "className" | "onClick">
  ) => (
    <Buttons.Common
      label="labels:links.delete"
      icon="fas fa-trash"
      path={props.path}
      className={"btn-danger " + (props.className ?? "")}
      disabled={props.disabled}
      onClick={props.onClick}
      type="button"
    />
  ),
  Reactivate: (
    props: Pick<IButtonProps, "path" | "disabled" | "className" | "onClick">
  ) => (
    <Buttons.Common
      label="labels:links.reactivate"
      icon="fas fa-check"
      path={props.path}
      className={"btn-info " + (props.className ?? "")}
      disabled={props.disabled}
      onClick={props.onClick}
      type="button"
    />
  ),
  GoTo: (
    props: Pick<IButtonProps, "path" | "onClick" | "disabled" | "className">
  ) => {
    const history = useHistory();
    const { pushAbsolute } = useFullLocation();

    const goto = () => {
      props.path && pushAbsolute(props.path.toString());
    };

    return (
      <Buttons.Common
        label="labels:links.go_back"
        icon="fas fa-arrow-left"
        disabled={props.disabled}
        onClick={props.onClick ?? goto}
        className={"btn-outline-primary " + (props.className ?? "")}
      />
    );
  },
  Form: (
    props: Pick<
      IButtonProps,
      "disabled" | "className" | "isLoading" | "iconLoading" | "icon"
    >
  ) => {
    const { label } = useLocalization();

    const iconLoading: string =
      props.iconLoading || "fas fa-circle-notch fa-spin";
    const iconSave: string = props.icon || "fas fa-save";

    return (
      <Button
        variant="primary"
        type="submit"
        className={"float-right mt-4"}
        disabled={props.isLoading}
      >
        <i className={`mr-3 ${props.isLoading ? iconLoading : iconSave}`} />
        {props.isLoading ? label("saving") : label("save")}
      </Button>
    );
  },
};
