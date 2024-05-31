// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../../../typings.d.ts'/>
import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { useApi } from "../../../Common/Hooks/useApi";
import * as logo_icon from "../../../Assets/images/logo-icon.png";
import * as logo_white from "../../../Assets/images/logo-text-white.png";
import { IAppState } from "../../../Store/AppStore";
import { Links } from "../../../Config/Links";
import { Dispatch, bindActionCreators } from "redux";
import { toggleNav } from "../../../Store/Template/TemplateActionCreators";
import { NavLeft } from "./NavLeft";
import { NavRight } from "./NavRight";
import { useEmpresa } from "../../../Common/Hooks/useEmpresa";
import { useParametros } from "../../../Common/Hooks/useParametros";

interface Props {
  headerColor: string;
  fixedHeader: boolean;
  collapseMenu: boolean;
  layout: string;
  sublayout: string;
  toggleNav: () => void;
}

interface State {
  rightToggle: boolean;
}

const NavBar = (props: Props) => {
  const datosEmpresa = useEmpresa();
  // const datosParametros = useParametros();

  const [state, setState] = useState<State>({
    rightToggle: false,
  });

  let headerClass = [
    "navbar",
    "pcoded-header",
    "navbar-expand-lg",
    "header-dark",
  ];

  document.body.classList.remove(
    "background-blue",
    "background-red",
    "background-purple",
    "background-info",
    "background-green",
    "background-dark"
  );

  document.body.classList.remove(
    "background-grd-blue",
    "background-grd-red",
    "background-grd-purple",
    "background-grd-info",
    "background-grd-green",
    "background-grd-dark"
  );

  document.body.classList.remove(
    "background-img-1",
    "background-img-2",
    "background-img-3",
    "background-img-4",
    "background-img-5",
    "background-img-6"
  );

  document.body.classList.add(props.headerColor);

  if (props.fixedHeader) {
    headerClass = [...headerClass, "headerpos-fixed"];
  }

  let toggleClass = ["mobile-menu"];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, "on"];
  }

  let navHtml;
  if (!state.rightToggle && window.outerWidth < 992) {
    navHtml = "";
  } else {
    navHtml = (
      <div className="collapse navbar-collapse d-flex">
        <NavLeft />
        <NavRight />
      </div>
    );
  }

  let navBar = (
    <Fragment>
      <div className="m-header">
        <a
          className={toggleClass.join(" ")}
          id="mobile-collapse1"
          href={Links.BLANK}
          onClick={props.toggleNav}
        >
          <span />
        </a>
        <NavLink to="/" className="b-brand">
          {/* <img id='main-logo' src={logo_icon} alt='' className='logo mr-2' />
					<img id='main-logo' src={logo_white} alt='' className='logo' /> */}
          <span
            className="ml-3 login-brand"
            style={{ fontFamily: "helvetica", textTransform: "uppercase" }}
          >
            {datosEmpresa.nombre_sistema}
          </span>
        </NavLink>
        <a
          className="mob-toggler"
          href={Links.BLANK}
          onClick={() =>
            setState((prevState) => {
              return { rightToggle: !prevState.rightToggle };
            })
          }
        >
          <i className="feather icon-more-vertical" />
        </a>
      </div>
      {navHtml}
    </Fragment>
  );

  if (props.layout === "horizontal" && props.sublayout === "horizontal-2") {
    navBar = <div className="container">{navBar}</div>;
  }

  return (
    <Fragment>
      <header
        className={headerClass.join(" ")}
        style={{ background: "var(--dark)" }}
      >
        {navBar}
      </header>
    </Fragment>
  );
};

const mapProps = (
  state: IAppState
): Pick<
  Props,
  "headerColor" | "fixedHeader" | "collapseMenu" | "layout" | "sublayout"
> => {
  return {
    headerColor: state.template.headerColor,
    fixedHeader: state.template.fixedHeader,
    collapseMenu: state.template.collapseMenu,
    layout: state.template.layout,
    sublayout: state.template.subLayout,
  };
};

const mapDispatch = (dispatch: Dispatch): Pick<Props, "toggleNav"> => {
  return bindActionCreators(
    {
      toggleNav,
    },
    dispatch
  );
};

export const EnhancedNavbar = connect(mapProps, mapDispatch)(NavBar);
