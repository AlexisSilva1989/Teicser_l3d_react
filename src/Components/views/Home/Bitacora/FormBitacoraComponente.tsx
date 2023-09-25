import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { RadioSelect } from "../../../Forms/RadioSelect";

import { ApiSelect } from "../../../Api/ApiSelect";
import { $j } from "../../../../Common/Utils/Reimports";
import {
  BitacoraComponentesColumns,
  BitacoraComponentesForm,
} from "../../../../Data/Models/Binnacle/BitacoraComponentes";
interface IProps {
  onSubmit: (data: BitacoraComponentesForm) => void;
  isSaving?: boolean;
  initialData?: Partial<BitacoraComponentesColumns>;
  isEdit?: boolean;
}

const FormBitacoraComponente = ({
  onSubmit,
  isSaving,
  initialData,
  isEdit = false,
}: IProps) => {
  //hooks
  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, control, errors, setValue, register } =
    useForm<BitacoraComponentesForm>({
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
      { nombre: initialData?.nombre },
      { std_job: initialData?.std_job },
      { ubicacion_id: initialData?.ubicacion_id },
      { equipo_id: initialData?.equipo_id },
      { fabricante_id: initialData?.fabricante_id },
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
              label={`Std Job *`}
              name={"std_job"}
              id={"std_job"}
              placeholder={"Std Job"}
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
            <Controller
              control={control}
              as={ApiSelect}
              source={$j("service_render/equipos")}
              selector={(option: any) => ({
                label: option.nombre,
                value: option.id,
              })}
              rules={{
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
              }}
              label={`Equipo *`}
              name={"equipo_id"}
              id={"equipo_id"}
              errorForm={errors.ubicacion_id}
              isSelectFirtsOption={false}
            />
          </Col>
          <Col sm={12} className={"mb-2"}>
            <Controller
              control={control}
              as={ApiSelect}
              source={$j("fabricantes/select")}
              selector={(option: any) => ({
                label: option.name,
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
              label={`Fabricante *`}
              name={"fabricante_id"}
              id={"fabricante_id"}
              errorForm={errors.ubicacion_id}
              isSelectFirtsOption={false}
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
              name={"ubicacion_id"}
              id={"ubicacion_id"}
              errorForm={errors.ubicacion_id}
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

export default FormBitacoraComponente;
