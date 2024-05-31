import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  IDataTableColumn,
  IDataTableConditionalRowStyles,
} from "react-data-table-component";
import { SearchBar } from "../Forms/SearchBar";
import { ApiTable } from "./ApiTable";
import { useSearch } from "../../Common/Hooks/useSearch";
import { useShortModal } from "../../Common/Hooks/useModal";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { Modal, Row, Col, Button } from "react-bootstrap";
import { useApi } from "../../Common/Hooks/useApi";
import { useDashboard } from "../../Common/Hooks/useDashboard";
import { useInit } from "../../Common/Hooks/useInit";

interface Props<T> {
  id?: string;
  params?: any;
  name?: string;
  errors?: string[];
  clear?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  defaultValue?: T;
  size?: "sm" | "lg" | "xl";
  source: string | T[];
  columns: IDataTableColumn<T>[];
  State?: boolean;
  rowStyles?: IDataTableConditionalRowStyles<T>[];
  titleButton?: string;
  onOpen?: () => void;
  onClear?: () => void;
  filter?: (row: T) => boolean;
  default?: (row: T) => boolean;
  onChange?: (row: T | null) => void;

  Buttom?: () => void;

  displaySelector: (value: T) => string;
}

export const PickModal = <T extends unknown>(props: Props<T>) => {
  const api = useApi();
  const { input, placeholder, title } = useLocalization();
  const { onClear, onChange } = props;
  const { setLoading } = useDashboard();

  const modal = useShortModal();
  const [initFetch, doInitFetch] = useInit();
  const [initDefault, doInitDefault] = useInit();
  const [params] = useState(props.params);
  const [source, setSource] = useState<T[]>([]);
  const [search, doSearch] = useSearch();
  const [value, setValue] = useState<T>();

  const onClearCallback = useCallback(() => {
    setValue(undefined);
    if (onChange != null) {
      onChange(null);
    }
    if (onClear != null) {
      onClear();
    }
  }, [onClear, onChange]);

  const onChangeCallback = useCallback(
    (row: T) => {
      modal.hide();
      setValue(row);
      if (onChange != null) {
        onChange(row);
      }
    },
    [modal, onChange]
  );

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let data: T[] = [];
      if (typeof props.source === "string") {
        await api
          .get<T[]>(props.source, { params: params })
          .success((e) => {
            data = e;
          })
          .fail("base.load");
      }
      setSource(data);

      setLoading(false);
    }

    if (props.disabled) {
      return;
    }

    if (typeof props.source !== "string") {
      setSource(props.source);
    } else if (!initFetch) {
      fetch();
      doInitFetch();
    }
  }, [
    props.source,
    api,
    props.disabled,
    params,
    setLoading,
    props.default,
    onChangeCallback,
    initFetch,
    doInitFetch,
    props.defaultValue,
  ]);

  useEffect(() => {
    if (initDefault) {
      return;
    }
    if (props.disabled) {
      if (props.defaultValue != null) {
        onChangeCallback(props.defaultValue);
        doInitDefault();
      }
    } else {
      if (props.default != null) {
        const def = source.find(props.default);
        if (def != null) {
          onChangeCallback(def);
        }
        doInitDefault();
      } else if (props.defaultValue != null) {
        onChangeCallback(props.defaultValue);
        doInitDefault();
      }
    }
  }, [
    initDefault,
    doInitDefault,
    source,
    onChangeCallback,
    props.default,
    props.disabled,
    props.defaultValue,
  ]);

  useEffect(() => {
    if (props.clear) {
      onClearCallback();
    }
    if (props.State) {
      modal.hide();
    }
  }, [props.clear, onClearCallback]);

  return (
    <div className="api-pick">
      {props.name && (
        <label>
          <b>{input(props.name)}:</b>
        </label>
      )}
      <div className="input-group">
        <div className="input-group-prepend api-pick-search">
          <i
            className="fas fa-table input-group-text"
            style={props.disabled ? {} : { cursor: "pointer" }}
            onClick={() => {
              if (!props.disabled) {
                modal.show();
              }
            }}
          />
        </div>
        <input
          placeholder={
            props.placeholder ? placeholder(props.placeholder) : undefined
          }
          className={`btn form-control bg-white api-pick-input ${
            props.className ?? ""
          }`}
          style={props.disabled ? { cursor: "default" } : { cursor: "pointer" }}
          value={value ? props.displaySelector(value) : ""}
          readOnly
          name={props.id}
          disabled={props.disabled}
          onClick={() => {
            if (!props.disabled) {
              modal.show();
            }
          }}
        />

        {value && (props.disabled == null || !props.disabled) && (
          <div
            className="input-group-append api-pick-clear"
            style={{ cursor: "pointer" }}
          >
            <i
              className="fas fa-lg fa-times input-group-text bg-white text-danger"
              onClick={onClearCallback}
            />
          </div>
        )}
      </div>
      {props.errors && (
        <div>
          {props.errors.map((e: any, i: number) => (
            <Fragment key={i}>
              <small className="text-danger">{e}</small>
              <br />
            </Fragment>
          ))}
        </div>
      )}
      {props.Buttom}

      <Modal show={modal.visible} onHide={modal.hide} size={props.size ?? "xl"}>
        <Modal.Header closeButton />
        <Modal.Body>
          <Row className="p-2">
            <Col sm={8}>
              {props.Buttom ? (
                <Button variant="outline-warning" onClick={props.Buttom}>
                  <i className="fas fa-check-square mr-3" />
                  {title(props.titleButton ?? "add_machine_alt")}
                </Button>
              ) : (
                ""
              )}
            </Col>
            <Col sm={4}>
              <SearchBar onChange={doSearch} />
            </Col>
            <Col sm={12}>
              <ApiTable<T>
                search={search}
                customFilter={props.filter}
                queryParams={props.params}
                columns={props.columns}
                source={source}
                onSelect={onChangeCallback}
                rowStyles={props.rowStyles}
                reload={true}
              />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};
