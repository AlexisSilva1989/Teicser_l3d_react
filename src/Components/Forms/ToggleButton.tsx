import { useRef, useState, useEffect } from "react";
import React from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";

type ButtonVariant = "primary" | "secondary" | "warning" | "danger" | "info";

interface Props {
  icon?: string;
  label?: string;
  active?: boolean;
  toggle?: boolean;
  outline?: boolean;
  className?: string;
  variant?: ButtonVariant;
  onChange?: (active: boolean) => void;
}

export const ToggleButton = (props: Props) => {
  const { capitalize: caps } = useFullIntl();

  const [active, setActive] = useState(props.active ?? false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const { onChange } = props;

  useEffect(() => {
    if (onChange != null) {
      onChange(active);
    }
  }, [active, onChange]);

  useEffect(() => {
    if (props.toggle) {
      $(buttonRef.current!).toggle();
      setActive((s) => !s);
    }
  }, [setActive, props.toggle]);

  function onClick() {
    setActive((s) => !s);
  }

  return (
    <button
      className={`btn ${active ? "active" : ""} btn-${
        props.outline ? "outline-" : ""
      }${props.variant ?? "primary"} ${props.className ?? ""}`}
      ref={buttonRef}
      data-toggle="button"
      onClick={onClick}
    >
      {props.icon && <i className={props.icon + " mr-3"} />}
      {props.label && caps(props.label)}
    </button>
  );
};
