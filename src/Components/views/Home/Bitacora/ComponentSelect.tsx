import React, { useState, useEffect, Fragment } from "react";

import "../../../Api/test.css";
import { FieldError } from "react-hook-form";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { $u } from "../../../../Common/Utils/Reimports";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { pushError } from "../../../../Store/Dashboard/DashboardActionCreators";
import { ComponenteBitacora } from "../../../../Data/Models/Binnacle/Binnacle";
import { LoadingSpinner } from "../../../Common/LoadingSpinner";

interface Props<T> {
  id?: string;
  name?: string;
  label?: string;
  errors?: string[];
  errorForm?: FieldError;
  source: string | T[];
  value?: ComponenteBitacora[];
  placeholder?: string;
  queryParams?: any;
  className?: string;
  filter?: (x: OptionType) => boolean;
  onChange?: (value: any[]) => void;
  selector: (data: T) => OptionType;
  isLoading?: boolean;
  isRequired?: boolean;
  disabled?: boolean;
}

interface List<T> {
  data: T[];
  loading: boolean;
  init: boolean;
  disabled: boolean;
}

export interface ValueDisplay {
  value: string;
  display: string;
}

export type OptionType = {
  value: string;
  label: string;
};

export const ComponentSelect = <T extends unknown>({
  label = "Componentes",
  isRequired = false,
  className = "",
  source,
  selector,
  errors,
  errorForm,
  onChange,
  queryParams,
  filter,
  value,
  disabled = false,
}: Props<T>) => {
  const { capitalize: caps } = useFullIntl();

  const initial: List<T> = {
    data: [],
    loading: true,
    disabled: true,
    init: false,
  };

  // STATES
  const [optionList, setOptionList] = useState<List<T>>(initial);
  const [optionsSelected, setOptionsSelected] = useState<ComponenteBitacora[]>(
    []
  );

  const optionListFiltered = optionList.data.map((el) => selector(el));

  // METHODS
  const handleComponentSelect = (component: OptionType) => {
    if (!disabled) {
      const isSelected =
        optionsSelected.findIndex(
          (option) => option.id === Number(component.value)
        ) !== -1;

      if (!isSelected) {
        setOptionsSelected((state) => [
          ...state,
          {
            id: Number(component.value),
            has_all_parts: true,
            part_number: undefined,
          },
        ]);
        return;
      }
      setOptionsSelected((state) =>
        state.filter((option) => option.id !== Number(component.value))
      );
    }
  };

  const handleCheckAllPart = (componentId: number, value: boolean) => {
    const componentIndex = optionsSelected.findIndex(
      (option) => option.id === componentId
    );
    componentIndex !== -1 &&
      setOptionsSelected((state) =>
        $u(state, {
          [componentIndex]: {
            $merge: {
              has_all_parts: value,
            },
          },
        })
      );
  };

  const handlePartNumberChange = (componentId: number, value: string) => {
    const componentIndex = optionsSelected.findIndex(
      (option) => option.id === componentId
    );
    componentIndex !== -1 &&
      setOptionsSelected((state) =>
        $u(state, {
          [componentIndex]: {
            $merge: {
              part_number: value,
            },
          },
        })
      );
  };

  const mappingSourceArray = () => {
    if (Array.isArray(source)) {
      const d =
        filter == null ? source : source.filter((x) => filter(selector(x)));
      setOptionList((s) => $u(s, { $merge: { data: d ?? [] } }));
    }
  };

  const fetch = async () => {
    setOptionList((state) => ({ ...state, loading: true }));
    if (typeof source === "string") {
      const result = await ax
        .get<T[]>(source, { params: queryParams })
        .then((response) => {
          if (response.data) {
            const d =
              filter == null
                ? response.data
                : response.data.filter((x) => filter(selector(x)));

            setOptionList((s) => $u(s, { $merge: { data: d ?? [] } }));
          }
        })
        .catch(() => pushError("errors.enumLoad"));
    } else {
      mappingSourceArray();
    }
    setOptionList((state) => ({ ...state, loading: false }));
  };

  // EFFECTS
  useEffect(() => {
    if (!disabled) {
      console.log({ queryParams });
      if (!Array.isArray(source)) {
        fetch();
        return;
      }
      setOptionList((state) => ({
        ...state,
        data: source,
      }));
    }
    setOptionList((state) => ({ ...state, loading: false, data: [] }));
  }, [source, queryParams]);

  useEffect(() => {
    onChange && onChange(optionsSelected);
  }, [optionsSelected]);

  useEffect(() => {
    value && setOptionsSelected(value);
  }, [value]);

  return (
    <div className={"ServerSelect form-group " + className}>
      {label && (
        <label>
          <b>
            {caps(label)}
            {isRequired && <span className="text-danger"> (*)</span>}:
          </b>
        </label>
      )}
      {optionList.loading ? (
        <div
          style={{
            height: 196,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className="d-flex flex-column align-items-start justify-content-start w-100 border rounded"
          style={{ height: 196, overflowY: "scroll", gap: 1 }}
        >
          {optionListFiltered.map((option) => {
            const isSelected = optionsSelected
              .map((option) => option.id)
              .includes(Number(option.value));
            const selectedComponent = optionsSelected.find(
              (optionSelected) => optionSelected.id === Number(option.value)
            );
            return (
              <div
                key={option.value}
                className={`w-100 px-2 py-1 d-flex justify-content-between align-items-center font-weight-bold `}
                style={{
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "rgba(70, 128, 255, 0.5)"
                    : "transparent",
                }}
              >
                <label
                  className="w-100 d-flex align-items-center mb-0 h-100"
                  style={{
                    gap: 8,
                    cursor: "pointer",
                  }}
                  // onClick={() => handleComponentSelect(option)}
                >
                  <input
                    type="checkbox"
                    name={option.label}
                    checked={isSelected}
                    onChange={() => handleComponentSelect(option)}
                    style={{
                      cursor: "pointer",
                    }}
                  />

                  {option.label}
                </label>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    gap: 16,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Numero de parte"
                    onClick={() => {
                      if (selectedComponent?.has_all_parts) {
                        handleCheckAllPart(Number(option.value), false);
                      }
                    }}
                    // disabled={!isSelected || selectedComponent?.has_all_parts}
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: "0.25rem",
                      border: "1px solid #e3eaef",
                      padding: 5,
                      fontSize: "1rem",
                    }}
                    onChange={(e: any) => {
                      handlePartNumberChange(
                        Number(option.value),
                        e.target.value
                      );
                    }}
                    value={
                      selectedComponent
                        ? selectedComponent.part_number !== "Todas"
                          ? selectedComponent.part_number
                          : ""
                        : ""
                    }
                  />
                  <label
                    className="d-flex align-items-center justify-content-start  m-0"
                    style={{
                      whiteSpace: "nowrap",
                      gap: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedComponent
                          ? selectedComponent.has_all_parts
                          : false
                      }
                      onChange={(e) =>
                        handleCheckAllPart(
                          Number(option.value),
                          e.target.checked
                        )
                      }
                      disabled={!isSelected}
                    />
                    Todas las partes
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* <Select
        id={props.id ?? "select"}
        name={props.name}
        placeholder={
          props.placeholder == null ? undefined : caps(props.placeholder)
        }
        options={options}
        getOptionLabel={({ label }) => label}
        getOptionValue={({ value }) => value}
        onChange={handleChange}
        value={optionsValue}
        isDisabled={props.isDisabled}
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
        isLoading={state.loading}
        menuPortalTarget={
          props.menuPortalTarget == "body"
            ? document.body
            : document.parentElement
        }
      /> */}
      {errors && (
        <div>
          {errors.map((e, i) => {
            return (
              <Fragment key={i}>
                <small className="text-danger">{e}</small>
                <br />
              </Fragment>
            );
          })}
        </div>
      )}

      {errorForm && (
        <div>
          <small className="text-danger">{errorForm.message}</small>
        </div>
      )}
    </div>
  );
};
