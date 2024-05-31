import React, { Fragment } from "react";
import { EnhancedNavItem } from "./NavItem";
import { IMenu } from "../../../Store/Dashboard/IDashboardState";
import { EnhancedNavCollapse } from "./NavCollapse";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";

type BadgeData = { [key: string]: number };

interface Props {
  group: IMenu;
  badges: BadgeData;
}

export const NavGroup = (props: Props) => {
  const { capitalize: caps } = useFullIntl();

  function badgeCount(badge?: string) {
    if (badge == null) {
      return undefined;
    }
    return props.badges[badge];
  }

  const navItems = props.group.submenus?.map((item, i) => {
    return (
      <EnhancedNavCollapse
        key={i}
        collapse={item}
        type="main"
        badgeData={props.badges}
      />
    );
  });

  const navMods = props.group.modules?.map((item, i) => {
    return (
      <EnhancedNavItem
        key={i}
        item={item}
        badgeCount={badgeCount(item.badgeId)}
      />
    );
  });

  return (
    <Fragment>
      <li key={props.group.name} className="nav-item pcoded-menu-caption">
        <label>{caps(props.group.name)}</label>
      </li>
      {navItems}
      {navMods}
    </Fragment>
  );
};
