import React from "react";
import { Modal } from "react-bootstrap";
import {
  IColumnasBitacora,
  IDataFormBitacora,
} from "../../Data/Models/Binnacle/Binnacle";
import FormBitacora from "../views/Home/Bitacora/FormBitacora";

interface Props<T> {
  show: boolean;
  hide: () => void;
  size?: "sm" | "lg" | "xl";
  title?: string;
  textButton?: string;
  onSubmit: (data: IDataFormBitacora) => void;
  initialState?: IColumnasBitacora;
  isLoading?: boolean;
  modalType: "agregar" | "editar";
}

const BitacoraFormModal = <T extends unknown>({
  show,
  size = "sm",
  hide,
  title = "",
  onSubmit,
  initialState,
  isLoading = false,
  modalType,
}: Props<T>) => {
  return (
    <Modal show={show} size={size} onHide={hide} centered>
      <Modal.Header className="bg-dark text-white font-weight-bold">
        {title}
        <div onClick={() => hide()} style={{ cursor: "pointer" }}>
          <i className="fas fa-times text-white" />
        </div>
      </Modal.Header>
      <Modal.Body className="col-12 mb-3">
        <FormBitacora
          onSubmit={onSubmit}
          isSaving={isLoading}
          isEdit={modalType === "editar"}
          initialData={initialState}
        />
      </Modal.Body>
    </Modal>
  );
};

export default BitacoraFormModal;
