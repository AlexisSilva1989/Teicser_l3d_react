import React, { Fragment, useState, useRef } from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { Col, Row, Button, Card } from "react-bootstrap";
import { ax } from "../../Common/Utils/AxiosCustom";
import { $j, $d } from "../../Common/Utils/Reimports";
import { Links } from "../../Config/Links";
import { AxiosResponse, AxiosError } from "axios";
import { useNotifications } from "../../Common/Hooks/useNotifications";
interface Props {
  accept?: string;
  label?: string;
  errors?: string[];
  onChange?: (e: File | null) => void;
}

export const ItemsRequestUpload = (props: Props) => {
  const { capitalize: caps } = useFullIntl();
  const { push } = useNotifications();
  const [display, setDisplay] = useState<string>();
  const input = useRef<HTMLInputElement>(null);

  function openFileSelect() {
    input.current?.click();
  }

  async function downloadExampleFile() {
    await ax
      .get($j(Links.SERVICES, "solicitudes_articulos", "ejemplo"), {
        responseType: "blob",
      })
      .then((e: AxiosResponse) => {
        $d(e.data, "ejemplo_solicitud.xlsx", e.headers["content-type"]);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          push.error("errors:base.download", {
            element: "errors:elements.excel",
            code: e.response.status,
          });
        }
      });
  }

  return (
    <>
      <div className="input-group">
        <input
          type="text"
          className="form-control border rounded"
          onClick={openFileSelect}
          placeholder={caps("placeholders:file_not_selected")}
          style={{ cursor: "pointer" }}
          defaultValue={display}
        />
        <div
          className="input-group-append"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDisplay(() => undefined);
            if (props.onChange != null) {
              props.onChange(null);
            }
          }}
        >
          <span className="input-group-text">
            <i className="text-danger text-center fas fa-trash" />
          </span>
        </div>

        <div
          className="input-group-append"
          style={{ cursor: "pointer" }}
          onClick={downloadExampleFile}
        >
          <span className="input-group-text">
            <i className="text-success text-center fas fa-download" />
          </span>
        </div>

        <div
          className="input-group-append"
          style={{ cursor: "pointer" }}
          onClick={openFileSelect}
        >
          <span className="input-group-text">
            <i className="text-success text-center fas fa-upload" />
          </span>
        </div>
      </div>

      <input
        type="file"
        accept={props.accept}
        style={{ display: "none", height: "0px" }}
        ref={input}
        onChange={(e) => {
          const files = e.target.files;
          setDisplay(() => (files ? files[0].name : undefined));
          if (props.onChange != null) {
            props.onChange(files ? files[0] : null);
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
    </>
  );
};
