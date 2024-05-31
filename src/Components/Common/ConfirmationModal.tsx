import React, { forwardRef, Ref, PropsWithChildren, RefObject } from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";

interface Props {
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// TODO: Remove ref, use props
export const ConfirmationModal = forwardRef<
  HTMLDivElement,
  PropsWithChildren<Props>
>((props: PropsWithChildren<Props>, ref: Ref<HTMLDivElement>) => {
  const { capitalize: caps } = useFullIntl();

  function onClickCancel() {
    $((ref as RefObject<HTMLDivElement>).current!).modal("hide");
    if (props.onCancel != null) {
      props.onCancel();
    }
  }

  function onClickConfirm() {
    $((ref as RefObject<HTMLDivElement>).current!).modal("hide");
    if (props.onConfirm != null) {
      props.onConfirm();
    }
  }

  return (
    <div
      className="modal"
      data-backdrop="static"
      data-keyboard="false"
      tabIndex={-1}
      role="dialog"
      ref={ref}
    >
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {caps(props.title ?? "titles:confirm_action")}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={props.onCancel}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {props.children && <div className="modal-body">{props.children}</div>}
          <div className="modal-footer text-right p-3">
            <button className="btn btn-primary mr-3" onClick={onClickConfirm}>
              {caps("labels:links.confirm")}
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={onClickCancel}
              data-dismiss="modal"
            >
              {caps("labels:links.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
