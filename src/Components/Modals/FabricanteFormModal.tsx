import React from 'react'
import FormFabricante from '../views/Home/Fabricante/FormFabricante';
import { IDataFormFabricante } from '../../Data/Models/Fabricante/Fabricante';
import { Modal } from 'react-bootstrap';

interface Props<T> {
  show: boolean;
  hide: () => void;
  size?: "sm" | "lg" | "xl";
  title?: string;
  textButton?: string;
  onSubmit: (data: IDataFormFabricante) => void;
  initialState?: IDataFormFabricante;
  isLoading?: boolean;
  modalType: "agregar" | "editar"
}

const FabricanteFormModal = <T extends unknown>({ show, size = "sm", hide, title = '', textButton = "Enviar", onSubmit, initialState, isLoading = false, modalType }: Props<T>) => {

  return (<Modal show={show} size={size} onHide={hide} centered >
    <Modal.Header className='bg-dark text-white font-weight-bold' >
      {title}
    </Modal.Header>
    <Modal.Body className="col-12 mb-3">
      <FormFabricante
        onSubmit={onSubmit}
        isSaving={isLoading}
        isEdit={modalType === "editar"}
        initialData={initialState}
      />
    </Modal.Body>
  </Modal>
  );
}

export default FabricanteFormModal