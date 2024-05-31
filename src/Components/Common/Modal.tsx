import React, { forwardRef, PropsWithChildren, Ref } from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";

interface Props {
  title?: string;
  size?: string;
  onClose?: () => void;
}
type FullProps = PropsWithChildren<Props>;

export const Modal = forwardRef<HTMLDivElement, FullProps>(
  (props: FullProps, ref: Ref<HTMLDivElement>) => {
    const { capitalize: caps } = useFullIntl();

    return (
      <div className="modal" tabIndex={-1} role="dialog" ref={ref}>
        <div
          className={`modal-dialog ${props.size ? "modal-" + props.size : ""}`}
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              {props.title && (
                <h5 className="modal-title">{caps(props.title)}</h5>
              )}
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={props.onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {props.children}
          </div>
        </div>
      </div>
    );
  }
);
