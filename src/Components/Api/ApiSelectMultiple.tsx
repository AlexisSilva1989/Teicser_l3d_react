import React, { useEffect, useState } from "react";
import Select from "react-select";
import { OptionType } from "./ApiSelect";
import { FieldError } from "react-hook-form";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { ax } from "../../Common/Utils/AxiosCustom";
import { $u } from "../../Common/Utils/Reimports";
import { pushError } from "../../Store/Dashboard/DashboardActionCreators";

interface Props<T> {
  source: string | T[];
  value?: OptionType[];
  selector: (data: T) => OptionType;
  onChange?: (values: OptionType[]) => void;
  filter?: (x: OptionType) => boolean;
  onFinishLoad?: () => void;
  label?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  queryParams?: any;
  className?: string;
  disabled?: boolean;
  errors?: string[];
  errorForm?: FieldError;
}

const ApiSelectMultiple = <T extends unknown>({
  source,
  selector,
  value,
  onChange,
  label,
  name,
  id,
  placeholder,
  queryParams,
  className,
  disabled,
  errors,
  errorForm,
  filter,
  onFinishLoad,
}: Props<T>) => {
  // HOOKS
  const { capitalize: caps } = useFullIntl();

  // STATES
  const [optionList, setOptionList] = useState<OptionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInit, setHasInit] = useState<boolean>(false);
  // const [optionsSelected, setOptionsSelected] = useState<OptionType[]>([]);

  // METHODS

  const getMappedSource = (data: T[]) => {
    if (Array.isArray(data)) {
      const options =
        filter && filter !== null
          ? data
              .map((option) => selector(option))
              .filter((option) => filter(option))
          : data.map((option) => selector(option));
      setOptionList((state) =>
        $u(state, {
          $set: options,
        })
      );
    }
  };

  const fetchOptions = async () => {
    if (hasInit) return;
    if (typeof source === "string") {
      setIsLoading(true);
      await ax
        .get(source, { params: queryParams })
        .then((response) => {
          if (response.data) {
            const data =
              filter && filter !== null
                ? response.data.filter((option: T) => filter(selector(option)))
                : response.data.map((option: T) => selector(option));

            setOptionList((state) =>
              $u(state, {
                $merge: data ?? [],
              })
            );
          }
        })
        .catch(() => pushError("errors.enumLoad"))
        .finally(() => {
          setIsLoading(false);
          setHasInit(true);
          onFinishLoad && onFinishLoad();
        });
    } else {
      getMappedSource(source);
      setHasInit(true);
    }
  };

  // EFFECTS
  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (Array.isArray(source)) {
      getMappedSource(source);
    }
  }, [source]);

  return (
    <div className="w-100">
      {label && (
        <label>
          <b>{label}:</b>
        </label>
      )}
      <Select
        options={optionList}
        onChange={(data: any) => {
          onChange && onChange(data);
        }}
        value={value}
        className="mb-0"
        isMulti
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "calc(1.5em + 1.25rem + 1.75px)",
            borderColor: "#e3eaef",
            borderRadius: "0.25rem",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            div: { padding: 5 },
          }),
        }}
      />
    </div>
  );
};

export default ApiSelectMultiple;
