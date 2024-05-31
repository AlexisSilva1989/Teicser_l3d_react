import { Fragment } from "react";
import React from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";

interface Props {
  accept?: string;
  label?: string;
  errors?: string[];
  multiple?: boolean;
  onChange?: (e: FileList | null) => void;
}

export const FileSelect = (props: Props) => {
  const { capitalize: caps } = useFullIntl();

  return (
    <Fragment>
      {props.label && (
        <label>
          <b>{caps(props.label)}:</b>
        </label>
      )}
      <input
        type="file"
        className="form-control border rounded"
        accept={props.accept}
        multiple={props.multiple}
        style={{ height: "30px" }}
        onChange={(e) => {
          const files = e.target.files;
          if (props.onChange != null) {
            props.onChange(files);
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
