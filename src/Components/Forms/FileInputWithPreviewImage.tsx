import React, { useState, ChangeEvent, useEffect, useMemo } from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import preview_article from "../../Assets/images/preview_article.jpg";
import { Utils } from "../../Common/Utils/Utils";

export type acceptedFormat = "jpg" | "png" | "gif" | "jpeg";
interface Props {
  accept?: acceptedFormat[];
  label?: string;
  errors?: string[];
  id: string;
  onChange?: (e: FileList | null) => void;
  src?: string;
  name?: string;
  multiple?: boolean;
}

export const FileInputWithPreviewImage = (props: Props) => {
  const { capitalize: caps } = useFullIntl();
  const [previewImage, setPreviewImage] = useState<string>(preview_article);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (props.src) {
      setPreviewImage(props.src);
    }
  }, [props.src]);

  const handleChangePreviewImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = URL.createObjectURL(event.currentTarget.files[0]);
      setPreviewImage(file);
    }
  };

  const acceptFormat = useMemo(() => {
    if (props.accept && props.accept.length > 0) {
      const accept = props.accept.reduce((acc, format) => {
        return `${acc},image/${format}`;
      }, "");
      return accept.substr(1, accept.length);
    }

    return "image/jpg,image/png,image/jpeg,image/git";
  }, [props.accept, props.accept?.length]);

  return (
    <div>
      {props.label && (
        <label>
          <b>{caps(props.label)}:</b>
        </label>
      )}

      <div
        className={"d-flex justify-content-center align-items-center"}
        style={{
          border: error ? "1px solid red" : "1px solid transparent",
          backgroundColor: "rgba(0,0,0,0.05)",
          width: "100%",
          minHeight: "200px",
          maxHeight: "200px",
        }}
      >
        <label
          htmlFor={props.id}
          style={{ marginBottom: "0px", cursor: "pointer" }}
        >
          <div>
            <img
              src={previewImage}
              alt={previewImage}
              style={{ maxWidth: "100%", maxHeight: "198px" }}
            />
          </div>
        </label>
        <input
          id={props.id}
          type="file"
          accept={acceptFormat}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : undefined;
            const accept = props.accept ?? [];
            let isValidFormat = false;
            if (file) {
              isValidFormat = Utils.validateImageFormat(file, accept);
            }
            if (isValidFormat) {
              handleChangePreviewImage(e);
              const files = e.target.files;
              if (props.onChange != null) {
                props.onChange(files);
              }
              setError(false);
            } else {
              setError(true);
            }
          }}
          name={props.name}
        />
      </div>
      {error && (
        <div className="text-danger">
          {" "}
          Formato invalido (validos:{" "}
          {props.accept && props.accept.join(", ").toUpperCase()})
        </div>
      )}
    </div>
  );
};
