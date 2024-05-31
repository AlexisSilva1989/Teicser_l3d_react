import React from "react";
import { useLocalization } from "../../../../Common/Hooks/useLocalization";
import { Button, Modal } from "react-bootstrap";

interface Props {
  visible: boolean;
  hide: () => void;
  onSubmit: () => void;
}

export const ConfirmarModificarParametro = (props: Props) => {
  const { visible, hide, onSubmit } = props;
  const { title, label, message } = useLocalization();

  return (
    <Modal show={visible} onHide={hide}>
      <Modal.Header closeButton>
        <b>{title("confirm_parameter_modification")}</b>
      </Modal.Header>
      <Modal.Body>
        {message("confirmations.on_modify_parameter_1")}
        <br />
        <br />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button variant="outline-secondary" onClick={hide} className="mr-3">
          {label("cancel")}
        </Button>
        <Button variant="danger" onClick={onSubmit}>
          <i className="fas fa-save mr-3" />
          {label("save_changes")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
