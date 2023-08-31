import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { IDataFormComponentesPlano } from "../../../../Data/Models/ComponentesPlano/componentes_plano";
interface IProps {
  onSubmit: (data: IDataFormComponentesPlano) => void
  isSaving?: boolean
  initialData?: IDataFormComponentesPlano
  isEdit?: boolean
}

const FormComponentesPlano = ({ onSubmit, isSaving, initialData, isEdit = false }: IProps) => {

  //hooks
  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, control, errors, setValue, register } = useForm<IDataFormComponentesPlano>({
    mode: "onSubmit",
    submitFocusError: true
  });

  //effects
  useEffect(() => {
    { isEdit && register({ name: "id" }, { required: true }) }
  }, [register])

  useEffect(() => {

    setValue([
      { nombre: initialData?.nombre },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);

    console.log('initialData: ', initialData);
  }, [initialData]);


  return (<>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={12} className={"mb-2"}>
          <Textbox
            label={`Nombre *`}
            name={"nombre"}
            id={"nombre"}
            placeholder={"Nombre"}
            ref={register({
              required: { value: true, message: caps('validations:required') },
              maxLength: {
                value: 50,
                message: "Máximo 50 caracteres permitidos",
              },
            })}
            errorForm={errors.nombre}
          />
        </Col>

        {
          isEdit && <Col sm={12}>
            <label><b>Activo *:</b></label>
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
          </Col>
        }
      </Row>

      <Row>
        <Col sm={12} className={"text-right mt-3"}>
          <Button variant={"primary"} type="submit" disabled={isSaving}>
            {isSaving
              ? (<i className="fas fa-circle-notch fa-spin mr-3"></i>)
              : isEdit
                ? (<i className="fas fa-save mr-3" />)
                : (<i className="fas fa-plus mr-3" />)
            }
            {
              isEdit ? "Guardar" : "Agregar"
            }
          </Button>
        </Col>
      </Row>

    </form>
  </>);
}

export default FormComponentesPlano