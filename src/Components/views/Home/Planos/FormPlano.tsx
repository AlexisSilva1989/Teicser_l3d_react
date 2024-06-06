import React, { useEffect, useState } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { $j, $u } from "../../../../Common/Utils/Reimports";
import { FileInputWithDescription } from "../../../Forms/FileInputWithDescription";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { ApiSelect } from "../../../Api/ApiSelect";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { IDataFormPlanos } from "../../../../Data/Models/Binnacle/planos";
import { SelectAdd, ValueDisplay } from "../../../Forms/SelectAdd";
import { useShortModal } from "../../../../Common/Hooks/useModal";
import { IFabricante } from "../../../../Data/Models/Fabricantes/fabricantes";
import FabricanteFormModal from "../../../Modals/FabricanteFormModal";
import {
  IDataColumnComponentesPlano,
  IDataFormComponentesPlano,
} from "../../../../Data/Models/ComponentesPlano/componentes_plano";
import { IDataFormFabricante } from "../../../../Data/Models/Fabricante/Fabricante";
import { useReload } from "../../../../Common/Hooks/useReload";
import ComponentesPlanoFormModal from "../../../Modals/ComponentesPlanoFormModal";

interface IProps {
  initialData?: IDataFormPlanos;
  onFinishSaving?: () => void;
}

const LOCATIONS_TEST = [
  {
    id: 1,
    name: "Ubicacion 1",
  },
  {
    id: 2,
    name: "Ubicacion 2",
  },
];

const FormPlano = ({ initialData, onFinishSaving }: IProps) => {
  //hooks
  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, watch } =
    useForm<IDataFormPlanos>({
      mode: "onSubmit",
      submitFocusError: true,
    });
  const [reloadManufacturersList, doReloadManufacturersList] = useReload();
  const [reloadPlansComponents, doReloadPlansComponents] = useReload();
  const manufacturersModal = useShortModal();
  const plansComponentsModal = useShortModal();

  //states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingEquipo, setIsLoadingEquipo] = useState<boolean>(false);
  const [isLoadingComponente, setIsLoadingComponente] =
    useState<boolean>(false);
  const [isLoadingFabricante, setIsLoadingFabricante] =
    useState<boolean>(false);
  const [display, setDisplay] = useState<string>();
  const [manufacturerAux, setManufacturerAux] = useState<
    IDataFormFabricante | undefined
  >();
  const [componenteAux, setComponenteAux] = useState<
    Partial<IDataColumnComponentesPlano> | undefined
  >();

  //EFFECTS
  useEffect(() => {
    setValue([
      { equipo: initialData?.equipo },
      { tipo_plano: initialData?.tipo_plano },
    ]);
  }, [initialData]);

  useEffect(() => {
    setIsLoadingFabricante(true);
    setIsLoadingComponente(true);
  }, []);

  //HANDLES
  const onSubmit = async (data: IDataFormPlanos) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    formData.append("idEquipo", data?.equipo as string);
    formData.append("file", data?.plano);

    let pathPlano = "planos_conjunto";
    if (data.tipo_plano === "planos_componentes") {
      formData.append("idFabricante", data.fabricante as string);
      formData.append("idComponente", data.componente as string);
      pathPlano = "planos_componentes";
    }

    setIsSaving(true);
    await ax
      .post(pathPlano, formData, headers)
      .then((response) => {
        setDisplay(undefined);
        addToast("Plano cargado correctamente", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const msgError = e.response.data.errors
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : caps("errors:base.post", { element: "planos de componentes" });
          addToast(msgError, { appearance: "error", autoDismiss: true });
        }
      })
      .finally(() => {
        setIsSaving(false);
        onFinishSaving && onFinishSaving();
      });
  };

  const onSubmitAddManufacturer = async (data: IDataFormFabricante) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("nombre", data.name);
    // formData.append("components_selected", JSON.stringify(data.components_selected));

    setIsSaving(true);
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
        setIsSaving(false);
      });
  };

  const onSubmitAddPlansComponents = async (
    data: IDataFormComponentesPlano
  ) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("nombre", data.nombre);

    setIsSaving(true);
    await ax
      .post("componentes_planos", formData, headers)
      .then((response) => {
        plansComponentsModal.hide();
        doReloadPlansComponents();
        setValue("componente", response.data.element);
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(
            caps("errors:base.post", { element: "componentes del plano" }),
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const watchFields = watch(["tipo_plano"]);
  const locationWatch = watch("location");


  useEffect(() => {
    setValue("componente", undefined);
    locationWatch && doReloadPlansComponents();
  }, [locationWatch]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <Row>
          <Col className="mb-3">
            <Controller
              control={control}
              name="equipo"
              label="Equipo *"
              rules={{ required: caps("validations:required") }}
              source={"service_render/equipos"}
              queryParams={{ isSelectFilter: true }}
              placeholder={"Seleccione equipo ..."}
              selector={(option: any) => {
                return { label: option.nombre, value: option.id };
              }}
              as={ApiSelect}
              defaultValue={initialData?.equipo ?? undefined}
              onFinishLoad={() => {
                setIsLoadingEquipo(false);
              }}
              onStartLoad={() => setIsLoadingEquipo(true)}
            />
            <ErrorMessage errors={errors} name="equipo">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>

        <Row>
          <Col className="mb-3">
            <Controller
              control={control}
              name="tipo_plano"
              label="Tipo de plano *"
              rules={{ required: caps("validations:required") }}
              source={[
                {
                  label: "Conjunto",
                  value: "planos_conjunto",
                },
                {
                  label: "Componente",
                  value: "planos_componentes",
                },
              ]}
              placeholder={"Seleccione tipo de plano ..."}
              selector={(option: any) => {
                return { label: option.label, value: option.value };
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="tipo_plano">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>

        <Row hidden={watchFields["tipo_plano"] === "planos_conjunto"}>
          <Col className="mb-3">
            <Controller
              control={control}
              name="fabricante"
              label="Fabricante *"
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
              as={SelectAdd}
            />
            <ErrorMessage errors={errors} name="fabricante">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>

        <Row hidden={watchFields["tipo_plano"] === "planos_conjunto"}>
          <Col className="mb-3">
            <Controller
              control={control}
              name="location"
              label="Ubicacion"
              source={"locations"}
              placeholder={"Seleccione una ubicacion ..."}
              selector={(option: any) => {
                return { label: option.nombre, value: option.id };
              }}
              isSelectFirtsOption
              // onStartLoad={() => {
              //   setIsLoadingFabricante(true);
              // }}
              // onFinishLoad={() => {
              //   setIsLoadingFabricante(false);
              // }}
              // reload={reloadManufacturersList}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="location">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>

        <Row hidden={watchFields["tipo_plano"] === "planos_conjunto"}>
          <Col className="mb-3">
            <Controller
              control={control}
              name="componente"
              label="Componente *"
              rules={{ required: caps("validations:required") }}
              source={"componentes_planos/select"}
              queryParams={{
                location: [locationWatch],
              }}
              placeholder={"Seleccione componente ..."}
              selector={(option: any) => {
                return { display: option.nombre, value: option.id };
              }}
              placeholderAddElement={"Agregar Componente: "}
              onCreateOption={(plansComponentName: string) => {
                setComponenteAux({
                  nombre: plansComponentName,
                });
                plansComponentsModal.show();
              }}
              as={SelectAdd}
              onStartLoad={() => {
                setIsLoadingComponente(true);
              }}
              onFinishLoad={() => {
                setIsLoadingComponente(false);
              }}
              reload={reloadPlansComponents}
            />
            <ErrorMessage errors={errors} name="componente">
              {({ message }) => (
                <small className={"text-danger"}>{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>

        <Row>
          <Col className="mb-3">
            <Controller
              control={control}
              id={"plano"}
              name={"plano"}
              label="Plano"
              onChangeDisplay={(display: string | undefined) => {
                setDisplay((state) => $u(state, { $set: display }));
              }}
              display={display}
              accept={["pdf"]}
              rules={{
                required: {
                  value: true,
                  message: "Por favor, seleccione un archivo",
                },
              }}
              as={FileInputWithDescription}
            />

            <ErrorMessage errors={errors} name="plano">
              {({ message }) => (
                <small className="text-danger">{message}</small>
              )}
            </ErrorMessage>
          </Col>
        </Row>

        <Row>
          <Col sm={12} className={"text-right mt-3"}>
            <Button
              variant={"primary"}
              type="submit"
              disabled={
                isSaving ||
                isLoadingEquipo ||
                isLoadingFabricante ||
                isLoadingComponente
              }
            >
              {isSaving ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  {" "}
                  <i className="fas fa-save mr-3" /> {"Guardar"}{" "}
                </>
              )}
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

      <ComponentesPlanoFormModal
        show={plansComponentsModal.visible}
        hide={plansComponentsModal.hide}
        size="sm"
        modalType={"agregar"}
        onSubmit={onSubmitAddPlansComponents}
        isLoading={isSaving}
        title={`Agregar Componentes de Planos`}
        initialState={componenteAux}
      />
    </>
  );
};

export default FormPlano;
