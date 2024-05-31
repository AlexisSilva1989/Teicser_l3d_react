import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Fullscreen from "react-full-screen";
import { EnhancedNavigation } from "./Navigation/Navigation";
import { EnhancedNavbar } from "./NavBar/Navbar";
import Configuration from "./Configuration/Configuration";
import routes from "../../Config/Routes";
import { $j } from "../../Common/Utils/Reimports";
import { useTemplate } from "../../Common/Hooks/useTemplate";
import { useLocalization } from "../../Common/Hooks/useLocalization";

import { Home } from "../../Views/Home";

export const AdminLayout = () => {
  const {
    fullscreen,
    collapseMenu,
    layout,
    sublayout,
    contentOnly,
    showConfiguration,
    toggleNav,
    setFullscreen,
  } = useTemplate();
  const { localize } = useLocalization();

  const [paths, setPaths] = useState<string[]>([]);

  // START: Template code
  function fullScreenExitHandler() {
    if (!document.fullscreenElement) {
      setFullscreen(false);
    }
  }

  useEffect(() => {
    if (
      window.outerWidth > 992 &&
      window.outerWidth <= 1024 &&
      layout !== "horizontal"
    ) {
      toggleNav();
    }
  });

  function mobileOutClickHandler() {
    if (window.outerWidth < 992 && collapseMenu) {
      toggleNav();
    }
  }

  document.addEventListener("fullscreenchange", fullScreenExitHandler);
  document.addEventListener("webkitfullscreenchange", fullScreenExitHandler);
  document.addEventListener("mozfullscreenchange", fullScreenExitHandler);
  document.addEventListener("MSFullscreenChange", fullScreenExitHandler);
  // END: Template code

  const menusMemo = useMemo(() => {
    return routes.map((group) => {
      return group.routes?.map((route, index) => {
        const prefix = localize(group.prefix);

        const path = localize(
          route.path,
          route.element ? { element: localize(route.element) } : undefined
        );

        const pushedPath = $j("/", prefix === "/" ? "" : prefix, path);

        setPaths((state) => [...state, pushedPath]);
        return (
          <Route
            key={index}
            path={pushedPath}
            exact={route.exact == null ? true : route.exact}
          >
            {route.component}
          </Route>
        );
      });
    });
  }, [localize]);

  let mainClass = ["pcoded-wrapper"];
  if (layout === "horizontal" && sublayout === "horizontal-2") {
    mainClass = [...mainClass, "container"];
  }

  return (
    <Fragment>
      <Fullscreen enabled={fullscreen}>
        {!contentOnly && <EnhancedNavigation />}
        {!contentOnly && <EnhancedNavbar />}
        <div
          className={"pcoded-main-container"}
          onClick={() => mobileOutClickHandler}
        >
          <div className={mainClass.join(" ")}>
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <div className="container-fluid">
                      <Switch>{menusMemo}</Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showConfiguration && <Configuration />}
      </Fullscreen>
    </Fragment>
  );
};
