import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { $u } from "../../Common/Utils/Reimports";
import { Attachment } from "../../Data/Models/Common/general";

interface Props {
  label?: string;
  required?: boolean;
  onChange?: (data: Partial<Attachment>[]) => void;
  value?: Partial<Attachment>[];
}

interface ApplicationPreviewIcon {
  class: string;
  color: string;
}

const APPLICATION_ICONS: { [key: string]: ApplicationPreviewIcon } = {
  pdf: { class: "fas fa-file-pdf", color: "244, 15, 2" },
  xls: { class: "fas fa-file-excel", color: "29, 111, 66" },
  xlsx: { class: "fas fa-file-excel", color: "29, 111, 66" },
};

const FilesMultipleUploader = ({
  label = "Archivos",
  required,
  onChange,
  value,
}: Props) => {
  const [hasInit, setHasInit] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Partial<Attachment>[]>([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setAttachments((state) => [
        ...state,
        ...acceptedFiles.map((file: File) => ({ data: file, action: "add" })),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    onDrop,
  });

  const getFileType = (file: Partial<Attachment>) => {
    if (file?.data) {
      const fileType = file?.data?.type.split("/")[0];
      return fileType;
    }
    if (file.type) return file.type;
    return undefined;
  };

  const getFileExtension = (file: Partial<Attachment>) => {
    if (file?.data) {
      const fileNameArray = file?.data?.name.split(".");
      const fileExtension = fileNameArray[fileNameArray.length - 1];
      return fileExtension;
    }
    if (file.type) return file.extension;
    return undefined;
  };

  const getFileURL = (file: Partial<Attachment>) => {
    if (file?.data) {
      const URL = window.URL.createObjectURL(file?.data);
      return URL;
    }
    if (file.url) return file.url;
    return undefined;
  };

  // useEffect(() => {
  //   setAttachments(value)
  // }, [value])

  useEffect(() => {
    onChange && onChange(attachments);
  }, [attachments]);

  const getInitialValue = useCallback(() => {
    if (!hasInit && value) {
      setAttachments(value);
      setHasInit(true);
    }
  }, [value, hasInit]);

  useEffect(() => {
    getInitialValue();
  }, [value]);

  const handleDelete = (file: Partial<Attachment>, arrayIndex: number) => {
    if (file.id) {
      setAttachments((state) =>
        $u(state, {
          [arrayIndex]: {
            $merge: {
              action: "delete",
            },
          },
        })
      );
    } else {
      setAttachments((state) =>
        state.filter((file, index) => index !== arrayIndex)
      );
    }
  };

  const getControlButtons = (file: Partial<Attachment>, arrayIndex: number) => {
    return (
      <>
        {file.url && (
          <div
            className=" bg-light text-primary"
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              width: 28,
              height: 28,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={() => file?.data && window.open(file.url, "_blank")}
          >
            <i className="fas fa-file-download" />
          </div>
        )}
        <div
          className=" bg-light text-danger"
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            width: 28,
            height: 28,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={() => handleDelete(file, arrayIndex)}
        >
          <i className="fas fa-trash" />
        </div>
      </>
    );
  };

  const getImagePreview = (file: Partial<Attachment>, arrayIndex: number) => {
    return (
      <div
        key={file?.data?.name ?? file?.url}
        className=""
        style={{
          position: "relative",
          width: 192,
          height: 112,
          backgroundImage: `URL("${getFileURL(file)}")`,
          borderRadius: 8,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexShrink: 0,
        }}
      >
        {getControlButtons(file, arrayIndex)}
      </div>
    );
  };

  const getApplicationPreview = (
    file: Partial<Attachment>,
    arrayIndex: number
  ) => {
    const extension = getFileExtension(file);
    const icon = extension ? APPLICATION_ICONS[extension] : undefined;
    return (
      <div
        key={file?.data?.name ?? file?.url}
        style={{
          position: "relative",
          width: 192,
          height: 112,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `rgba(${icon?.color ?? "var(--light)"}, 0.2)`,
          borderRadius: 8,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          fontSize: 30,
          color: `rgb(${icon?.color ?? "var(--light)"})`,
          flexShrink: 0,
        }}
      >
        <i className={icon?.class ?? ""} />
        {getControlButtons(file, arrayIndex)}
      </div>
    );
  };

  return (
    <div className="d-flex flex-column " style={{ gap: 4 }}>
      <label>
        <b>{`${label} ${required ? "*" : ""}:`}</b>
      </label>
      <div
        className="d-flex w-full align-items-start"
        style={{ gap: 8, width: "100%", minWidth: "100%" }}
      >
        <div
          {...getRootProps()}
          style={{
            height: 112,
            width: 192,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            border: "2px dashed var(--dark)",
            fontSize: 28,
            color: "var(--dark)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <input {...getInputProps()} />
          <i className="fas fa-plus" />
        </div>
        <div
          className="d-flex justify-content-start align-items-center"
          style={{
            overflowX: "scroll",
            height: 130,
            gap: 4,
          }}
        >
          {attachments.map((file, index) => {
            return file.action !== "delete"
              ? getFileType(file) === "image"
                ? getImagePreview(file, index)
                : getApplicationPreview(file, index)
              : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default FilesMultipleUploader;
