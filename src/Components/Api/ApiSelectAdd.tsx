import React, { useState, useRef, Fragment } from "react";
import { IDataTableColumn } from "react-data-table-component";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { $u } from "../../Common/Utils/Reimports";
import { Modal } from "../Common/Modal";
import { SearchBar } from "../Forms/SearchBar";
import { Buttons } from "../Common/Buttons";
import { ApiTable } from "./ApiTable";

interface Props<T> {
  source: string;
  columns: IDataTableColumn<T>[];

  preload?: boolean;
  name?: string;
  label?: string;
  errors?: string[];
  queryParams?: any;
  className?: string;
  size?: "sm" | "lg" | "xl";
  onSelect?: (row: T) => void;
  customFilter?: (row: T) => boolean;
}

interface State<T> {
  search: string;
  load: boolean;
}

export const ApiSelectAdd = <T extends unknown>(props: Props<T>) => {
  const [state] = useState<State<T>>({
    search: "",
    load: props.preload ?? false,
  });
  const [load, setLoad] = useState(state.load);
  const [search, setSearch] = useState(state.search);
  const { capitalize: caps } = useFullIntl();
  const modal = useRef<HTMLDivElement>(null);

  function handleSearch(search: string) {
    setSearch((s) => $u(s, { $set: search }));
  }

  function loadModal() {
    setLoad((s) => $u(s, { $set: true }));
    $(modal.current!).modal("show");
  }

  function onSelect(row: T) {
    $(modal.current!).modal("hide");
    if (props.onSelect != null) {
      props.onSelect(row);
    }
  }

  return (
    <Fragment>
      {props.label && (
        <label>
          <b>{caps(props.label)}:</b>
        </label>
      )}
      <div className="input-group">
        <Buttons.Add onClick={loadModal} data-toggle="modal" />
        {props.errors && (
          <div>
            {props.errors.map((e: any, i: number) => {
              return (
                <Fragment key={i}>
                  <small className="text-danger">{e}</small>
                  <br />
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
      <Modal ref={modal} size={props.size}>
        <div className="modal-body">
          <div className="row p-2">
            <div className="col-12">
              <SearchBar onChange={handleSearch} />
            </div>
            <div className="col-12">
              <ApiTable<T>
                search={search}
                customFilter={props.customFilter}
                queryParams={props.queryParams}
                load={load}
                columns={props.columns}
                source={props.source}
                onSelect={onSelect}
              />
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
