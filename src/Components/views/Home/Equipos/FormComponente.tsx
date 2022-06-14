import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { IDataFormServer } from "../../../../Data/Models/Servidor/Servidor";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { IDataFormComponente } from "../../../../Data/Models/Componentes/Componentes";

interface IProps {
  onSubmit: (data: IDataFormComponente) => void
  isSaving?: boolean
  initialData?: IDataFormComponente
  isEdit?: boolean
}

const FormComponente = ({ onSubmit, isSaving, initialData, isEdit = false }: IProps) => {

  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, errors, setValue, register, control, setError, clearError } = useForm<IDataFormComponente>({
    mode: "onSubmit",
    submitFocusError: true,
  });

  useEffect(() => {
    { isEdit && register({ name: "id" }, { required: true }) }
  }, [register])

  useEffect(() => {
    console.log('initialData: ', initialData);
    setValue([
      { nombre: initialData?.nombre },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);
  }, [initialData]);

  return (<><form onSubmit={handleSubmit(onSubmit)}>
    <Row>
      <Col sm={3} className={"mb-2"}>
        <Textbox
          label={`Nombre *`}
          name={"nombre"}
          id={"nombre"}
          placeholder={"Nombre del componente"}
          ref={register({
            required: { value: true, message: caps('validations:required') },
            maxLength: {
              value: 25,
              message: "Máximo 25 caracteres permitidos",
            },
          })}
          errorForm={errors.nombre}
        />
      </Col>

      {isEdit && <Col sm={3}>
        <label><b>Activo:</b></label>
        <Controller control={control}
          name={"status"}
          options={[
            {
              label: "Si",
              value: "1"
            }, {
              label: "No",
              value: "0"
            }
          ]}

          rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
          as={RadioSelect}
        />

        <ErrorMessage errors={errors} name="status">
          {({ message }) => <small className='text-danger'>{message}</small>}
        </ErrorMessage>
      </Col>}
    </Row>

    <Row>
      <Col sm={12} className={"text-right mt-3"}>
        <Button variant={"primary"} type="submit" disabled={isSaving}>
          {isSaving
            ? (<i className="fas fa-circle-notch fa-spin"></i>)
            : isEdit
              ? (<> <i className="fas fa-save mr-3" /> {'Guardar'} </>)
              : (<> <i className="fas fa-plus mr-3" /> {'Agregar'} </>)
          }
        </Button>
      </Col>
    </Row>

  </form></>);
};

export default FormComponente