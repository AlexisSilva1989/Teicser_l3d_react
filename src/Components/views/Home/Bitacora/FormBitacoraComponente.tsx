import React, { useEffect, useState } from "react";
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
import { useShortModal } from "../../../../Common/Hooks/useModal";
import { SelectAdd } from "../../../Forms/SelectAdd";
import FabricanteFormModal from "../../../Modals/FabricanteFormModal";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { useReload } from "../../../../Common/Hooks/useReload";
import { useToasts } from "react-toast-notifications";
import { AxiosError } from "axios";
import { IDataFormFabricante } from "../../../../Data/Models/Fabricante/Fabricante";
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
  const manufacturersModal = useShortModal();
  const { addToast } = useToasts();

  const [isLoadingFabricante, setIsLoadingFabricante] = useState(false);
  const [reloadManufacturersList, doReloadManufacturersList] = useReload();
  const [manufacturerAux, setManufacturerAux] = useState<
    IDataFormFabricante | undefined
  >();
  const [isSavingManufacturer, setIsSavingManufacturer] = useState(false);

  //methods
  const onSubmitAddManufacturer = async (data: IDataFormFabricante) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("nombre", data.name);
    // formData.append("components_selected", JSON.stringify(data.components_selected));

    setIsSavingManufacturer(true);
    await ax
      .post("fabricantes", formData, headers)
      .then((response) => {
        manufacturersModal.hide();
        doReloadManufacturersList();
        setValue("fabricante", response.data.element);
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.post", { element: "fabricante" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsSavingManufacturer(false);
      });
  };

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
              label={`Std Job`}
              name={"std_job"}
              id={"std_job"}
              placeholder={"Std Job"}
              ref={register({})}
              errorForm={errors.std_job}
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
              errorForm={errors.equipo_id}
              isSelectFirtsOption={false}
            />
          </Col>
          <Col sm={12} className={"mb-2"}>
            <Controller
              control={control}
              name="fabricante_id"
              label="Fabricante "
              rules={{ required: caps("validations:required") }}
              source={"fabricantes/select"}
              placeholder={"Seleccione fabricante ..."}
              placeholderAddElement={"Agregar Fabricante: "}
              onCreateOption={(manufacturerName: string) => {
                setManufacturerAux({
                  name: manufacturerName,
                });
                manufacturersModal.show();
              }}
              selector={(option: any) => {
                return { display: option.name, value: option.id };
              }}
              onStartLoad={() => {
                setIsLoadingFabricante(true);
              }}
              onFinishLoad={() => {
                setIsLoadingFabricante(false);
              }}
              reload={reloadManufacturersList}
              isSelectFirstOption={false}
              as={SelectAdd}
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
      <FabricanteFormModal
        show={manufacturersModal.visible}
        hide={manufacturersModal.hide}
        size="sm"
        modalType={"agregar"}
        onSubmit={onSubmitAddManufacturer}
        isLoading={isSaving}
        title={`Agregar Fabricante`}
        initialState={manufacturerAux}
      />
    </>
  );
};

export default FormBitacoraComponente;
