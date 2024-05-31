import React, { Fragment } from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { IAppState } from "../../../Store/AppStore";
import { Dispatch, bindActionCreators } from "redux";
import {
  toggleBoxMode,
  toggleFixedHeader,
  toggleFixedNav,
  toggleRtl,
} from "../../../Store/Template/TemplateActionCreators";

interface Props {
  rtl: boolean;
  fixedNav: boolean;
  fixedHeader: boolean;
  boxMode: boolean;
  toggleRtl: () => void;
  toggleFixedNav: () => void;
  toggleFixedHeader: () => void;
  toggleBoxMode: () => void;
}

const LayoutOptions = (props: Props) => {
  let layoutOption = (
    <div className="form-group mb-0">
      <div className="switch switch-primary d-inline m-r-10">
        <input
          type="checkbox"
          id="box-layouts"
          checked={props.boxMode}
          onChange={props.toggleBoxMode}
        />
        <label htmlFor="box-layouts" className="cr" />
      </div>
      <label>Box Layouts</label>
    </div>
  );

  let layoutOptionHeaderFixWithoutBox: JSX.Element | null = null;
  let layoutOptionNavFixWithoutBox: JSX.Element | null = null;
  if (!props.boxMode) {
    layoutOptionHeaderFixWithoutBox = (
      <div className="form-group mb-0">
        <div className="switch switch-primary d-inline m-r-10">
          <input
            type="checkbox"
            id="header-fixed"
            checked={props.fixedHeader}
            onChange={props.toggleFixedHeader}
          />
          <label htmlFor="header-fixed" className="cr" />
        </div>
        <label>Header Fixed</label>
      </div>
    );
    layoutOptionNavFixWithoutBox = (
      <div className="form-group mb-0">
        <div className="switch switch-primary d-inline m-r-10">
          <input
            type="checkbox"
            id="menu-fixed"
            checked={props.fixedNav}
            onChange={props.toggleFixedNav}
          />
          <label htmlFor="menu-fixed" className="cr" />
        </div>
        <label>Menu Fixed</label>
      </div>
    );
  }

  layoutOption = (
    <div>
      <div className="form-group mb-0">
        <div className="switch switch-primary d-inline m-r-10">
          <input
            type="checkbox"
            id="theme-rtl"
            checked={props.rtl}
            onChange={props.toggleRtl}
          />
          <label htmlFor="theme-rtl" className="cr" />
        </div>
        <label>RTL</label>
      </div>
      {layoutOptionNavFixWithoutBox}
      {layoutOptionHeaderFixWithoutBox}
      {layoutOption}
    </div>
  );

  return (
    <Fragment>
      <div className="config-scroll">
        <PerfectScrollbar>{layoutOption}</PerfectScrollbar>
      </div>
    </Fragment>
  );
};

const mapProps = (
  state: IAppState
): Pick<Props, "rtl" | "fixedHeader" | "fixedNav" | "boxMode"> => {
  return {
    rtl: state.template.rtl,
    fixedNav: state.template.fixedNav,
    fixedHeader: state.template.fixedHeader,
    boxMode: state.template.boxMode,
  };
};

const mapDispatch = (
  dispatch: Dispatch
): Pick<
  Props,
  "toggleBoxMode" | "toggleFixedHeader" | "toggleFixedNav" | "toggleRtl"
> => {
  return bindActionCreators(
    {
      toggleBoxMode,
      toggleFixedHeader,
      toggleFixedNav,
      toggleRtl,
    },
    dispatch
  );
};

export const EnhancedLayoutOptions = connect(
  mapProps,
  mapDispatch
)(LayoutOptions);
