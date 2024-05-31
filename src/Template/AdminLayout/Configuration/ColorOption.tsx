import React from "react";
import { Links } from "../../../Config/Links";
import { IAppState } from "../../../Store/AppStore";
import { bindActionCreators, Dispatch } from "redux";
import { setHeaderColor } from "../../../Store/Template/TemplateActionCreators";
import { connect } from "react-redux";

interface Props {
  setHeaderColor: (color: string) => void;
  color: string;
  headerColor: string;
}

const ColorOption = (props: Props) => {
  function onChangeColor() {
    props.setHeaderColor(props.color);
  }

  return (
    <a
      href={Links.BLANK}
      onClick={onChangeColor}
      className={props.headerColor === props.color ? "active" : ""}
      data-value={props.color}
    >
      <span />
      <span />
    </a>
  );
};

interface IForwardProperties {
  color: string;
}

const mapProps = (
  state: IAppState,
  props: IForwardProperties
): Pick<Props, "color" | "headerColor"> => {
  return {
    color: props.color,
    headerColor: state.template.headerColor,
  };
};

const mapDispatch = (dispatch: Dispatch): Pick<Props, "setHeaderColor"> => {
  return bindActionCreators(
    {
      setHeaderColor,
    },
    dispatch
  );
};

export const EnhancedColorOption = connect(mapProps, mapDispatch)(ColorOption);
