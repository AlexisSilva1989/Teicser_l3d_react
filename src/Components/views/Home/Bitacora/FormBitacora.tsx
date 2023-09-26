import React, { useEffect, useMemo, useState } from "react";
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
import ApiSelectMultiple from "../../../Api/ApiSelectMultiple";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { usePermissions } from "../../../../Common/Hooks/usePermissions";

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
  const { canUpdate } = usePermissions();
  const {
    handleSubmit,
    control,
    errors,
    setValue,
    register,
    watch,
    formState: { touched },
  } = useForm<IDataFormBitacora>({
    mode: "onSubmit",
    submitFocusError: true,
  });

  const locationWatch = watch("location");
  const equipmentWatch = watch("equipment");

  const locationMemo = useMemo(() => locationWatch, [locationWatch]);
  const equipmentMemo = useMemo(() => equipmentWatch, [equipmentWatch]);

  const isComponenteSelectActive = useMemo(() => {
    return locationMemo?.length > 0 && equipmentMemo && locationMemo;
  }, [locationMemo, equipmentMemo]);

  const [equipmentInit, setEquipmentInit] = useState<boolean>(false);

  console.log({ locationMemo, equipmentMemo, isComponenteSelectActive });

  //effects
  useEffect(() => {
    {
      isEdit && register({ name: "id" }, { required: true });
    }
  }, [register]);

  useEffect(() => {
    setValue([
      { id: initialData?.id },
      { show: initialData?.show?.toString() },
      { title: initialData?.title },
      { description: initialData?.description },
      { type: initialData?.tipo_evento.id },
      { equipment: initialData?.equipo.id },
      { location: initialData?.ubicaciones },
      { date: initialData?.date },
      { components: initialData?.componentes_planos },
      { files: initialData?.files },
    ]);
  }, [initialData]);

  // const onSubmit = (data: any) => {
  //   console.log({ data });
  // };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={12} md={4} className={"mb-2"}>
            <Controller
              control={control}
              label="Fecha del evento: *"
              name="date"
              rules={{ required: caps("validations:required") }}
              errorForm={errors.date}
              as={Datepicker}
            />
          </Col>
          <Col sm={12} md={8} className={"mb-2"}>
            <label>
              <b>Tipo de Evento *:</b>
            </label>
            <Controller
              control={control}
              name="type"
              rules={{ required: caps("validations:required") }}
              source={"tipo_eventos/select"}
              defaultValue={"-1"}
              selector={(option: any) => {
                return { label: option.nombre, value: option.id };
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
        </Row>
        <Row>
          <Col sm={12} md={4} className={"mb-2"}>
            <label>
              <b>Equipo *:</b>
            </label>
            <Controller
              control={control}
              name="equipment"
              rules={{ required: caps("validations:required") }}
              source={"service_render/equipos"}
              // source={EQUIPMENT_TEST}
              defaultValue={"-1"}
              selector={(option: any) => {
                return { label: option.nombre, value: option.id };
              }}
              onChange={(data) => {
                equipmentInit && setValue("components", []);
                return data[0];
              }}
              onFinishLoad={() => {
                setEquipmentInit(true);
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="equipment">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
          <Col sm={12} md={8} className={"mb-2"}>
            <Controller
              control={control}
              name="location"
              label="Ubicación"
              // rules={{ required: caps("validations:required") }}
              source={"locations"}
              defaultValue={"-1"}
              selector={(option: any) => {
                return {
                  label: option.nombre,
                  value: option.id,
                };
              }}
              onChange={(data) => {
                setValue("components", []);
                return data[0];
              }}
              as={ApiSelectMultiple}
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
              source={"/revestimientos/select"}
              queryParams={{
                ubicacion: locationMemo?.map((location) => location.value),
                equipo: equipmentMemo,
              }}
              selector={(component: any) => ({
                value: component.id.toString(),
                label: component.nombre,
              })}
              disabled={!isComponenteSelectActive}
              as={ComponentSelect}
            />
          </Col>
        </Row>
        {/* <Row>
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
        </Row> */}
        <Row>
          <Col sm={12} className={"mb-2"}>
            <TextArea
              label={`Descripción *`}
              name={"description"}
              placeholder={"Descripción del evento"}
              ref={register({
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
                // maxLength: {
                //   value: 240,
                //   message: "Máximo 240 caracteres permitidos",
                // },
              })}
              errorForm={errors.description}
            />
          </Col>
        </Row>
        {canUpdate("timeline_images") && (
          <Row>
            <Col sm={12} className={"mb-2"}>
              <Controller
                control={control}
                name="files"
                as={FilesMultipleUploader}
              />
            </Col>
          </Row>
        )}
        <Row>
          {isEdit && (
            <Col sm={3}>
              <label>
                <b>¿Es visible en timeline? *:</b>
              </label>
              <Controller
                control={control}
                name={"show"}
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

export default FormBitacora;
