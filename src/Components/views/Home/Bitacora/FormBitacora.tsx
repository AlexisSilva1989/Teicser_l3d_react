import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import {
  IColumnasBitacora,
  IDataFormBitacora,
} from "../../../../Data/Models/Binnacle/Binnacle";
import { TextArea } from "../../../Forms/TextArea";
import { ComponentSelect } from "./ComponentSelect";
import { ApiSelect } from "../../../Api/ApiSelect";
import { Datepicker } from "../../../Forms/Datepicker";
import FilesMultipleUploader from "../../../Forms/FilesMultipleUploader";

interface IProps {
  onSubmit: (data: IDataFormBitacora) => void;
  isSaving?: boolean;
  initialData?: IColumnasBitacora;
  isEdit?: boolean;
}

const COMPONENT_TEST = [
  {
    id: 1,
    name: "Componente 1",
  },
  {
    id: 2,
    name: "Componente 2",
  },
];
const LOCATION_TEST = [
  {
    id: 1,
    name: "Ubicación 1",
  },
  {
    id: 2,
    name: "Ubicación 2",
  },
];

const EQUIPMENT_TEST = [
  {
    id: 1,
    name: "Equipo 1",
  },
  {
    id: 2,
    name: "Equipo 2",
  },
];

const TYPE_TEST = [
  {
    id: 1,
    name: "Tipo Evento 1",
  },
  {
    id: 2,
    name: "Tipo Evento 2",
  },
];

const FormBitacora = ({
  onSubmit,
  isSaving,
  initialData,
  isEdit = false,
}: IProps) => {
  //hooks
  const { capitalize: caps } = useFullIntl();
  // const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, register, watch } =
    useForm<IDataFormBitacora>({
      mode: "onSubmit",
      submitFocusError: true,
    });

  const locationWatch = watch("location");
  const equipmentWatch = watch("equipment");

  //effects
  useEffect(() => {
    {
      isEdit && register({ name: "id" }, { required: true });
    }
  }, [register]);

  useEffect(() => {
    setValue([
      { id: initialData?.id },
      { status: initialData?.status },
      { title: initialData?.title },
      { description: initialData?.description },
      { type: initialData?.type.id },
      { equipment: initialData?.equipment.id },
      { location: initialData?.location.id },
      { date: initialData?.date },
      { components: initialData?.components },
      { files: initialData?.files },
    ]);

    console.log("initialData: ", initialData);
  }, [initialData]);

  // const onSubmit = (data: any) => {
  //   console.log({ data });
  // };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={12} md={6} className={"mb-2"}>
            <label>
              <b>Tipo de Evento *:</b>
            </label>
            <Controller
              control={control}
              name="type"
              rules={{ required: caps("validations:required") }}
              // source={"service_render/equipos/tipos"}
              source={TYPE_TEST}
              defaultValue={"-1"}
              selector={(option: any) => {
                return { label: option.name, value: option.id };
              }}
              onChange={(data) => {
                return data[0];
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="type">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
          <Col sm={12} md={6} className={"mb-2"}>
            <Controller
              control={control}
              label="Fecha del evento: *"
              name="date"
              rules={{ required: caps("validations:required") }}
              errorForm={errors.date}
              as={Datepicker}
            />
            <ErrorMessage errors={errors} name="date">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} className={"mb-2"}>
            <label>
              <b>Equipo *:</b>
            </label>
            <Controller
              control={control}
              name="equipment"
              rules={{ required: caps("validations:required") }}
              // source={"service_render/equipos"}
              source={EQUIPMENT_TEST}
              defaultValue={"-1"}
              selector={(option: any) => {
                return { label: option.name, value: option.id };
              }}
              onChange={(data) => {
                return data[0];
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="equipment">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
          <Col sm={12} md={6} className={"mb-2"}>
            <label>
              <b>Ubicación *:</b>
            </label>
            <Controller
              control={control}
              name="location"
              rules={{ required: caps("validations:required") }}
              // source={"service_render/equipos/tipos"}
              source={LOCATION_TEST}
              defaultValue={"-1"}
              selector={(option: any) => {
                return {
                  label: option.name,
                  value: option.id,
                };
              }}
              onChange={(data) => {
                return data[0];
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="location">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"mb-2"}>
            <Controller
              name="components"
              control={control}
              source={"/componentes_planos/select"}
              queryParams={{
                equipment: equipmentWatch,
                location: locationWatch,
              }}
              selector={(component: any) => ({
                value: component.id.toString(),
                label: component.nombre,
              })}
              as={ComponentSelect}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"mb-2"}>
            <Textbox
              label={`Título *`}
              name={"title"}
              id={"title"}
              placeholder={"Titulo del evento"}
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
              errorForm={errors.title}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"mb-2"}>
            <TextArea
              label={`Descripción`}
              name={"description"}
              placeholder={"Descripción del evento"}
              ref={register({
                // required: {
                //   value: true,
                //   message: caps("validations:required"),
                // },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres permitidos",
                },
              })}
              errorForm={errors.description}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"mb-2"}>
            <Controller
              control={control}
              name="files"
              as={FilesMultipleUploader}
            />
          </Col>
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

export default FormBitacora;
