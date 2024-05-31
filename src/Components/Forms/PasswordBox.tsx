import { Fragment, useState, useEffect } from "react";
import React from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";

interface Props {
  label?: string;
  name?: string;
  errors?: string[];
  value?: string;
  readonly?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (e: string) => void;
}

const _PasswordBox = (props: Props) => {
  const { capitalize: caps } = useFullIntl();
  const { onChange } = props;

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) {
      return;
    }
    if (props.value != null && onChange != null) {
      onChange(props.value);
      setInit(true);
    }
  }, [init, setInit, onChange, props.value]);

  return (
    <Fragment>
      {props.label && (
        <label>
          <b>{caps(props.label)}:</b>
        </label>
      )}
      <input
        type="password"
        value={props.value}
        name={props.name}
        className={"form-control border rounded " + props.className ?? ""}
        readOnly={props.readonly}
        placeholder={
          props.placeholder == null ? undefined : caps(props.placeholder)
        }
        onChange={(e) => {
          const val = e.currentTarget.value;
          if (props.onChange != null) {
            props.onChange(val);
          }
        }}
      />
      {props.errors && props.errors.length > 0 && (
        <div>
          {props.errors.map((e, i) => {
            return (
              <Fragment key={i}>
                <small className="text-danger" key={i}>
                  {e}
                </small>
                <br />
              </Fragment>
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

const PasswordBox = _PasswordBox;
export default PasswordBox;
