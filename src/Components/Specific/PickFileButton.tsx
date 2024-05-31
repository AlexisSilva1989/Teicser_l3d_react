import React, { useRef, useCallback, Fragment } from "react";
import { Button } from "react-bootstrap";
import { useLocalization } from "../../Common/Hooks/useLocalization";
interface Props {
  label: string;
  className?: string;

  accept?: string;
  onChange?: (file: File) => void;
}

export const PickFileButton = (props: Props) => {
  const { label } = useLocalization();
  const { onChange } = props;
  const input = useRef<HTMLInputElement>(null);

  function openFileSelect() {
    input.current?.click();
  }

  const onChangeFileCallback = useCallback(
    (input) => {
      const files = input.target.files;
      if (files == null) {
        return;
      }
      if (onChange != null) {
        onChange(files[0]);
      }
    },
    [onChange]
  );

  return (
    <Fragment>
      <Button
        variant="outline-success"
        type="button"
        onClick={openFileSelect}
        className={props.className}
      >
        <i className="mr-3 fas fa-upload" />
        {label(props.label)}
      </Button>
      <input
        type="file"
        className="form-control border rounded"
        accept={props.accept}
        style={{ height: "30px" }}
        ref={input}
        onChange={onChangeFileCallback}
        hidden
      />
    </Fragment>
  );
};
