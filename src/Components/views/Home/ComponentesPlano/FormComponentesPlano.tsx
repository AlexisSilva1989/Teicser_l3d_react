import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { RadioSelect } from "../../../Forms/RadioSelect";
import {
  IDataColumnComponentesPlano,
  IDataFormComponentesPlano,
} from "../../../../Data/Models/ComponentesPlano/componentes_plano";
import { ApiSelect } from "../../../Api/ApiSelect";
import { $j } from "../../../../Common/Utils/Reimports";
interface IProps {
  onSubmit: (data: IDataFormComponentesPlano) => void;
  isSaving?: boolean;
  initialData?: Partial<IDataColumnComponentesPlano>;
  isEdit?: boolean;
}

const FormComponentesPlano = ({
  onSubmit,
  isSaving,
  initialData,
  isEdit = false,
}: IProps) => {
  //hooks
  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, control, errors, setValue, register } =
    useForm<IDataFormComponentesPlano>({
      mode: "onSubmit",
      submitFocusError: true,
    });

  //effects
  useEffect(() => {
    {
      isEdit && register({ name: "id" }, { required: true });
    }
  }, [register]);

  useEffect(() => {
    setValue([
      { codigo: initialData?.codigo },
      { nombre: initialData?.nombre },
      { ubicacion: initialData?.ubicacion?.id },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);
  }, [initialData]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={12} className={"mb-2"}>
            <Textbox
              label={`Nombre *`}
              name={"nombre"}
              id={"nombre"}
              placeholder={"Nombre"}
              ref={register({
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres permitidos",
                },
              })}
              errorForm={errors.nombre}
            />
          </Col>
          <Col sm={12} className={"mb-2"}>
            <Textbox
              label={`Código`}
              name={"codigo"}
              id={"codigo"}
              placeholder={"Código"}
              ref={register()}
              errorForm={errors.codigo}
            />
          </Col>
          <Col sm={12} className={"mb-2"}>
            <Controller
              control={control}
              as={ApiSelect}
              source={$j("locations")}
              selector={(option: any) => ({
                label: option.nombre,
                value: option.id,
              })}
              rules={{
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres permitidos",
                },
              }}
              label={`Ubicación *`}
              name={"ubicacion"}
              id={"ubicacion"}
              errorForm={errors.ubicacion}
              isSelectFirtsOption={false}
            />
          </Col>

          {isEdit && (
            <Col sm={12}>
              <label>
                <b>Activo *:</b>
              </label>
              <Controller
                control={control}
                name={"status"}
                options={[
                  {
                    label: "Si",
                    value: "1",
                  },
                  {
                    label: "No",
                    value: "0",
                  },
                ]}
                rules={{
                  required: {
                    value: !isEdit,
                    message: caps("validations:required"),
                  },
                }}
                as={RadioSelect}
              />

              <ErrorMessage errors={errors} name="status">
                {({ message }) => (
                  <small className="text-danger">{message}</small>
                )}
              </ErrorMessage>
            </Col>
          )}
        </Row>

        <Row>
          <Col sm={12} className={"text-right mt-3"}>
            <Button variant={"primary"} type="submit" disabled={isSaving}>
              {isSaving ? (
                <i className="fas fa-circle-notch fa-spin mr-3"></i>
              ) : isEdit ? (
                <i className="fas fa-save mr-3" />
              ) : (
                <i className="fas fa-plus mr-3" />
              )}
              {isEdit ? "Guardar" : "Agregar"}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default FormComponentesPlano;
