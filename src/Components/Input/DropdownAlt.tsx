import React, { useEffect, useState, useMemo, useRef, Fragment } from "react";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { useInit } from "../../Common/Hooks/useInit";
import { useNotifications } from "../../Common/Hooks/useNotifications";
import { ax } from "../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { $u } from "../../Common/Utils/Reimports";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import Select, { ValueType } from "react-select";
import "../Api/test.css";
export interface DropdownOption {
  name: string;
  value: string;
}

interface Props<T> {
  id?: string;
  name?: string;
  value?: string;
  readonly?: boolean;
  localizeOptions?: boolean;
  wildcardOption?: DropdownOption;
  positionRelative?: boolean;
  source: DropdownOption[] | string;
  params?: any;
  mapSource?: (e: T) => DropdownOption;
  onChange?: (e: string) => void;
  errors?: string[];
}

export const DropdownAlt = <T extends unknown>(props: Props<T>) => {
  const { capitalize: caps } = useFullIntl();
  const ref = useRef<HTMLSelectElement>(null);
  const { onChange, mapSource } = props;
  const { push } = useNotifications();
  const { input, label } = useLocalization();

  const [init, doInit] = useInit();
  const [value, setValue] = useState<string>();
  const [options, setOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    async function fetch() {
      if (typeof props.source === "string") {
        if (mapSource == null) {
          throw new Error("Can't fetch dropdown data without source mapper");
        }
        await ax
          .get<T[]>(props.source, { params: props.params })
          .then((e) => {
            const mapped = e.data.map(mapSource);
            if (props.wildcardOption != null) {
              setOptions((s) => $u(s, { $push: mapped }));
            } else {
              setOptions((s) => $u(s, { $set: mapped }));
            }
            if (onChange) {
              if (props.wildcardOption != null) {
                onChange(props.wildcardOption.value);
              } else if (mapped.length > 0) {
                onChange(mapped[0].value);
              }
            }
          })
          .catch((e: AxiosError) =>
            push.error("base.load", { code: e.response?.status })
          );
      } else {
        const source = props.source as DropdownOption[];
        setOptions((s) => $u(s, { $push: source }));
        if (onChange) {
          if (props.wildcardOption != null) {
            onChange(props.wildcardOption.value);
          }
          // else if(source.length > 0) {
          // 	onChange(source[0].value);
          // }
        }
      }
    }

    if (props.wildcardOption) {
      setOptions([props.wildcardOption]);
      if (onChange) {
        onChange(props.wildcardOption.value);
      }
    } else {
      setOptions([]);
    }
    fetch();
  }, [
    props.source,
    push,
    mapSource,
    props.wildcardOption,
    onChange,
    props.params,
  ]);

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

  const optionsComponents = useMemo(() => {
    return options.map((o, i) => {
      return {
        label:
          props.localizeOptions == null ||
          props.localizeOptions ||
          (props.wildcardOption != null && i === 0)
            ? label(o.name)
            : o.name,
        value: o.value,
      };
    });
  }, [options, label, props.localizeOptions, props.wildcardOption]);

  function onChangeOption(e: any) {
    const val = e.value;
    setValue(val);
    if (props.onChange != null) {
      props.onChange(val);
    }
  }

  const groupClasses = ["input-group"];

  if (props.readonly) {
    groupClasses.push("disabled");
  }

  const optionsValue = optionsComponents?.filter((o, i) => {
    if (o.value === props.value || o.value === value) {
      return { label: caps(o.label), value: o.value };
    }
  });

  return (
    <>
      {props.name && (
        <label>
          <b>{input(props.name)}:</b>
        </label>
      )}
      {props.positionRelative ? (
        <Select
          isDisabled={props.readonly}
          name={props.id}
          options={optionsComponents}
          onChange={onChangeOption}
          disabled={props.readonly}
          value={optionsValue}
        />
      ) : (
        <Select
          name={props.id}
          options={optionsComponents}
          onChange={onChangeOption}
          disabled={props.readonly}
          menuPortalTarget={document.body}
          menuPosition={"absolute"}
          value={optionsValue}
        />
      )}
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
    </>
  );
};
