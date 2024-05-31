import React, { useState, Fragment, useCallback } from "react";
import "./NavRight.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { IMenu, IUserInfo } from "../../../Store/Dashboard/IDashboardState";
import { IAppState } from "../../../Store/AppStore";
import { logout } from "../../../Store/Dashboard/DashboardActionCreators";
import { SearchBar } from "../../../Components/Forms/SearchBar";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { $u } from "../../../Common/Utils/Reimports";

interface State {
  listOpen: boolean;
  search: string;
}

const initial: State = {
  listOpen: false,
  search: "",
};

export const NavRight = () => {
  const dispatch = useDispatch();
  const { capitalize: caps, localize } = useFullIntl();
  const { menus, user } = useSelector<
    IAppState,
    { menus: IMenu[]; user?: IUserInfo }
  >((x) => {
    return { menus: x.dashboard.menus.top, user: x.dashboard.user };
  });

  const [state, setState] = useState(initial);

  const doLogout = useCallback(() => dispatch(logout()), [dispatch]);

  function handleSearch(search: string) {
    setState($u(state, { $merge: { search } }));
  }

  return (
    <Fragment>
      <ul className="navbar-nav ml-auto">
        {menus &&
          menus.map((m) => (
            <li className="nav-item mx-2" key={m.name}>
              <div className="dropdown">
                <button
                  className="dropdown-toggle btn btn-link"
                  data-toggle="dropdown"
                >
                  <span className="sign-dd">
                    <i className={m.icon + " mr-1"} />
                    {caps(m.name)}
                  </span>
                </button>
                <div
                  className="dropdown-menu dropdown-menu-right chk-size"
                  style={{ minWidth: "300px" }}
                >
                  <SearchBar
                    placeholder="labels:search"
                    noLabel
                    outerClassName="p-2 mb-0"
                    className="border rounded"
                    onChange={handleSearch}
                  />
                  {m.submenus
                    ?.filter((x) =>
                      x.modules?.some((y) =>
                        new RegExp(state.search, "i").test(y.name)
                      )
                    )
                    .map((sm, i) => (
                      <div key={sm.name} className="dropdown-group">
                        <h6 className="dropdown-header text-primary">
                          {caps(sm.name)}
                        </h6>
                        <div className="dropdown-group-elements">
                          {sm.modules
                            ?.filter((x) =>
                              new RegExp(state.search, "i").test(x.name)
                            )
                            .map((mod) => (
                              <NavLink
                                key={mod.name}
                                to={
                                  "/" +
                                  localize(
                                    mod.path
                                      ? mod.path
                                      : "routes:meta.not_found"
                                  )
                                }
                                className="dropdown-item"
                              >
                                <i className={mod.icon + " mr-3"} />
                                {caps(mod.name)}
                              </NavLink>
                            ))}
                        </div>
                        {((m.submenus && i < m.submenus.length - 1) ||
                          m.modules != null) && (
                          <div className="dropdown-divider"></div>
                        )}
                      </div>
                    ))}
                  {m.modules
                    ?.filter((x) => new RegExp(state.search, "i").test(x.name))
                    .map((mod) => (
                      <NavLink
                        key={mod.name}
                        to={
                          "/" +
                          localize(
                            mod.path ? mod.path : "routes:meta.not_found"
                          )
                        }
                        className="dropdown-item"
                      >
                        <i className={mod.icon + " mr-3"} />
                        {caps(mod.name)}
                      </NavLink>
                    ))}
                </div>
              </div>
            </li>
          ))}
        <li className="nav-item ml-5">
          <span className="text-muted">
            {caps("messages:welcome")}, {user?.fullname}
          </span>
        </li>
        <li className="nav-item ml-3">
          <div className="dropdown">
            <button
              className="dropdown-toggle btn btn-link"
              data-toggle="dropdown"
            >
              <i
                style={{ lineHeight: "50px" }}
                className="far fa-user-circle fa-2x"
              ></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link
                to={"/" + localize("routes:base.change_password")}
                className="dropdown-item"
              >
                {caps("labels:links.change_password")}
              </Link>
              <Link
                to="#"
                onClick={() => doLogout()}
                className="text-danger dropdown-item"
              >
                {caps("labels:links.logout")}
              </Link>
            </div>
          </div>
        </li>
      </ul>
    </Fragment>
  );
};
