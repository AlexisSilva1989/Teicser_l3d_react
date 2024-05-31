import React, { useState, useEffect, Fragment } from "react";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { useInit } from "../../Common/Hooks/useInit";
import { ONLY_NUMBER } from "../../Enums";
import { useEmpresaLabel } from "../../Common/Hooks/useEmpresa";

interface Props {
  id?: string;
  name?: string;
  value?: string;
  readonly?: boolean;
  onlyNumber?: boolean;
  className?: string;
  placeholder?: string;
  industry?: boolean;
  maxLength?: number;
  onChange?: (e: string) => void;
  onKeyPress?: (e: string) => void;
  errors?: string[];
  inputOrientation?: string;
}

export const Textbox = (props: Props) => {
  const { onChange } = props;
  const { input, label } = useLocalization();
  const [init, doInit] = useInit();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (!init && props.value) {
      doInit();
      setValue(props.value);
      if (onChange) {
        onChange(props.value);
      }
    }
  }, [init, doInit, props.value, onChange, setValue]);

  function onChangeText(e: React.ChangeEvent<HTMLInputElement>) {
    // const val = e.currentTarget.value;
    // setValue(val);
    // if (props.onChange) { props.onChange(val); }

    let { value } = e.currentTarget;
    //if filter is required
    if (props.onlyNumber) {
      //replace value
      value = value.replace(ONLY_NUMBER, "");
    }

    //call funtion
    setValue(value);
    if (props.onChange) {
      props.onChange(value);
    }
  }

  function onKeyPressText(e: React.KeyboardEvent<HTMLInputElement>) {
    const val = e.currentTarget.value;
    setValue(val);
    if (props.onKeyPress) {
      props.onKeyPress(val);
    }
  }

  const name = props.name;

  const nameIndustry = input(
    props.name + "." + localStorage.getItem("industria")
  );

  const outerClasses = ["msig-textbox"];
  if (props.className) {
    outerClasses.push(props.className);
  }
  const innerClasses = ["form-control border msig-textbox-input"];
  if (props.readonly) {
    innerClasses.push("readonly");
  }
  if (props.inputOrientation) {
    innerClasses.push("text-" + props.inputOrientation);
  }

  return (
    <div className={outerClasses.join(" ")}>
      {name && (
        <label>
          <b>{props.industry ? nameIndustry : input(name)}:</b>
        </label>
      )}
      <div className="input-group">
        <input
          type="text"
          className={innerClasses.join(" ")}
          name={props.id}
          maxLength={props.maxLength}
          readOnly={props.readonly}
          placeholder={props.placeholder}
          value={value}
          onChange={onChangeText}
          onKeyPress={onKeyPressText}
        />
      </div>
      {props.errors && props.errors.length > 0 && (
        <div>
          {props.errors.map((e, i) => (
            <Fragment key={i}>
              <small className="text-danger" key={i}>
                {e}
              </small>
              <br />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
