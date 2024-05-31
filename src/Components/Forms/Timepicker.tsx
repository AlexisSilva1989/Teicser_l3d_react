import { Fragment, useState, useEffect, useCallback } from "react";
import React from "react";
import TimePicker from "rc-time-picker";
import { Moment } from "moment";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { IMoment } from "../../Common/Utils/Reimports";

interface Props {
  label?: string;
  name?: string;
  errors?: string[];
  value?: Moment;
  readonly?: boolean;
  className?: string;
  step?: number;
  onChange?: (e: Moment | null) => void;
}

interface State {
  value?: IMoment;
}

const initial: State = {};

export const Timepicker = (props: Props) => {
  const [init, setInit] = useState(false);
  const [value, setValue] = useState(initial.value);

  const { capitalize: caps } = useFullIntl();
  const { onChange } = props;

  const onChangeCallback = useCallback(
    (e: IMoment | null) => {
      setValue(e ?? undefined);
      if (onChange != null) {
        onChange(e);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (init) {
      return;
    }
    if (props.value != null) {
      onChangeCallback(props.value);
      setInit(true);
    }
  }, [init, setInit, onChangeCallback, props.value, onChange]);

  useEffect(() => {
    setValue(() => props.value);
  }, [props.value]);

  const innerClasses = ["form-control msig-timepicker-input p-0"];
  if (props.className) {
    innerClasses.push(props.className);
  }
  if (props.readonly) {
    innerClasses.push("readonly");
  }

  const iconClasses = ["input-group-prepend msig-timepicker-icon"];
  if (props.readonly) {
    iconClasses.push("readonly");
  }

  return (
    <div className="msig-timepicker">
      {props.label && (
        <label>
          <b>{caps(props.label)}:</b>
        </label>
      )}
      <div className="input-group">
        <div className={iconClasses.join(" ")}>
          <i className="fas fa-clock input-group-text" />
        </div>
        <TimePicker
          inputReadOnly={props.readonly}
          popupClassName="z-front"
          onChange={onChangeCallback}
          showSecond={false}
          value={value}
          className={innerClasses.join(" ")}
          minuteStep={props.step ?? 15}
          placement="topLeft"
        />
      </div>
      <input type="hidden" name={props.name} />
      <div>
        {props.errors &&
          props.errors.map((e, i) => {
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
    </div>
  );
};
