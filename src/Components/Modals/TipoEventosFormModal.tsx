import React from "react";
import { Modal } from "react-bootstrap";
import FormTipoEventos from "../views/Home/Bitacora/FormTipoEventos";
import {
  TypeEventsColumns,
  TypeEventsForm,
} from "../../Data/Models/Binnacle/TypeEvents";

interface Props<T> {
  show: boolean;
  hide: () => void;
  size?: "sm" | "lg" | "xl";
  title?: string;
  textButton?: string;
  onSubmit: (data: TypeEventsForm) => void;
  initialState?: Partial<TypeEventsColumns>;
  isLoading?: boolean;
  modalType: "agregar" | "editar";
}

const TipoEventosFormModal = <T extends unknown>({
  show,
  size = "sm",
  hide,
  title = "",
  textButton = "Enviar",
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
        <FormTipoEventos
          onSubmit={onSubmit}
          isSaving={isLoading}
          isEdit={modalType === "editar"}
          initialData={initialState}
        />
      </Modal.Body>
    </Modal>
  );
};

export default TipoEventosFormModal;
