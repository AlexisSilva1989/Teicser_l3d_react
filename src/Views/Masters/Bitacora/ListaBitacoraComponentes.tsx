import React, { useCallback, useEffect, useState } from "react";
import { ListaBase } from "../../Common/ListaBase";
import { $j, $u } from "../../../Common/Utils/Reimports";
import { ApiSelect } from "../../../Components/Api/ApiSelect";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { useShortModal } from "../../../Common/Hooks/useModal";
import { useReload } from "../../../Common/Hooks/useReload";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useToasts } from "react-toast-notifications";
import Axios, { AxiosError } from "axios";
import {
  ComponentesPlanoColumns,
  IComponentesPlano,
  IDataColumnComponentesPlano,
  IDataFormComponentesPlano,
} from "../../../Data/Models/ComponentesPlano/componentes_plano";
import ComponentesPlanoFormModal from "../../../Components/Modals/ComponentesPlanoFormModal";
import {
  BitacoraComponentesColumns,
  BitacoraComponentesForm,
  IBitacoraComponentes,
  IBitacoraComponentesColumns,
} from "../../../Data/Models/Binnacle/BitacoraComponentes";
import ComponentesBitacoraFormModal from "../../../Components/Modals/ComponentesBitacoraFormModal";
import ApiSelectMultiple from "../../../Components/Api/ApiSelectMultiple";

const ListaBitacoraComponentes = () => {
  const { capitalize: caps } = useFullIntl();
  const [reload, doReload] = useReload();
  const modalBitacoraComponentes = useShortModal();
  const { addToast } = useToasts();
  const source = Axios.CancelToken.source();

  const [filter, setFilter] = useState<{
    ubicacion?: string;
    fabricante?: string;
    equipo?: string;
    status?: string;
  }>({
    ubicacion: "-1",
    fabricante: "-1",
    equipo: "-1",
    status: "-1",
  });
  const [modalActionType, setModalActionType] = useState<"agregar" | "editar">(
    "agregar"
  );
  const [planosComponentesSelected, setPlanosComponentesSelected] = useState<
    IDataColumnComponentesPlano | undefined
  >();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [list, setList] = useState<BitacoraComponentesColumns[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const modals = [
    {
      label: "Agregar",
      action: () => {
        setPlanosComponentesSelected(undefined);
        setModalActionType("agregar");
        modalBitacoraComponentes.show();
      },
      className: "btn-primary",
    },
  ];

  // const customFilter = useCallback(
  //   (componentesPlano: IComponentesPlano): boolean => {
  //     const isFilterByStatus: boolean =
  //       filter.ubicacion == "-1" || componentesPlano.status == filter.status;
  //     return isFilterByStatus;
  //   },
  //   [filter]
  // );

  const getList = useCallback(async () => {
    setIsLoading(true);
    await ax
      .get("revestimientos", {
        params: {
          ...filter,
          ubicacion: filter.ubicacion === "-1" ? undefined : filter.ubicacion,
          fabricante:
            filter.fabricante === "-1" ? undefined : filter.fabricante,
          equipo: filter.equipo === "-1" ? undefined : filter.equipo,
          status: filter.status === "-1" ? undefined : filter.status,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        const { data }: { data: BitacoraComponentesColumns[] } = response;

        setList(data);

        doReload();
        setIsLoading(false);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          // setEvents(parseEventsToChronoItems(EVENT_TEST));
          // addToast(caps("errors:base.get", { element: "los eventos" }), {
          //   appearance: "error",
          //   autoDismiss: true,
          // });
        }
        if (Axios.isCancel(e.response)) {
          // Si la solicitud fue cancelada, puedes manejarlo aquí
          console.log("Solicitud cancelada:", e.response);
        }
        // setIsLoading(false);
      })
      .finally(() => {});
  }, [filter]);

  /*HANDLES */
  const onSubmitAdd = async (data: BitacoraComponentesForm) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    formData.append("nombre", data.nombre);
    formData.append("std_job", data.std_job);
    data.ubicacion_id &&
      formData.append("ubicacion_id", data.ubicacion_id?.toString());
    data.fabricante_id &&
      formData.append("fabricante_id", data.fabricante_id?.toString());
    data.equipo_id && formData.append("equipo_id", data.equipo_id?.toString());

    setIsSaving(true);
    await ax
      .post("revestimientos", formData, headers)
      .then((response) => {
        modalBitacoraComponentes.hide();
        getList();
        doReload();
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

  const onSubmitEdit = async (data: any) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("id_componente", data.id);
    formData.append("nombre", data.nombre);
    formData.append("std_job", data.std_job);
    data.ubicacion_id &&
      formData.append("ubicacion_id", data.ubicacion_id?.toString());
    data.fabricante_id &&
      formData.append("fabricante_id", data.fabricante_id?.toString());
    data.equipo_id && formData.append("equipo_id", data.equipo_id?.toString());
    formData.append("status", data.status);

    setIsSaving(true);
    await ax
      .patch("revestimientos", formData, headers)
      .then((response) => {
        modalBitacoraComponentes.hide();
        getList();
        doReload();
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

  useEffect(() => {
    getList();
    return () => {
      source.cancel(
        "Solicitud cancelada debido a la desaparición del componente"
      );
    };
  }, [filter]);

  return (
    <>
      <ListaBase<BitacoraComponentesColumns>
        title="titles:binnacle_components"
        source={list}
        permission="masters"
        columns={IBitacoraComponentesColumns}
        isRemoveAddButon
        modals={modals}
        reload={reload}
        loading={isLoading}
        onSelectWithModal={(data: any) => {
          setPlanosComponentesSelected(data);
          setModalActionType("editar");
          modalBitacoraComponentes.show();
        }}
      >
        <ApiSelect<{ label: string; value: string }>
          name="status"
          label="Activo"
          source={[
            {
              label: caps("labels:common.all"),
              value: "-1",
            },
            {
              label: caps("labels:common.yes"),
              value: "1",
            },
            {
              label: caps("labels:common.no"),
              value: "0",
            },
          ]}
          value={filter.status}
          selector={(option) => {
            return { label: option.label, value: option.value };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { status: { $set: data } }));
          }}
        />
        <ApiSelect
          label="Fabricante"
          name="manufacturer"
          source={$j("fabricantes/select")}
          value={filter.fabricante?.toString()}
          selector={(option: any) => ({
            label: option.name,
            value: option.id,
          })}
          onChange={(data) => {
            setFilter((state) =>
              $u(state, {
                fabricante: { $set: data },
              })
            );
          }}
          firtsOptions={{
            label: "Todos",
            value: "-1",
          }}
        />
        <ApiSelect
          label="Equipo"
          name="equipment"
          source={$j("service_render/equipos")}
          value={filter.equipo?.toString()}
          selector={(option: any) => ({
            label: option.nombre,
            value: option.id,
          })}
          onChange={(data) => {
            setFilter((state) =>
              $u(state, {
                equipo: { $set: data },
              })
            );
          }}
          firtsOptions={{
            label: "Todos",
            value: "-1",
          }}
        />
        <ApiSelect
          label="Ubicacion"
          source={"locations"}
          selector={(option: any) => ({
            label: option.nombre,
            value: option.id.toString(),
          })}
          onChange={(data: any) => {
            setFilter((state) =>
              $u(state, {
                ubicacion: { $set: data },
              })
            );
          }}
          value={filter.ubicacion?.toString()}
          firtsOptions={{
            label: "Todos",
            value: "-1",
          }}
        />
      </ListaBase>
      <ComponentesBitacoraFormModal
        show={modalBitacoraComponentes.visible}
        hide={modalBitacoraComponentes.hide}
        size="sm"
        modalType={modalActionType}
        onSubmit={modalActionType === "agregar" ? onSubmitAdd : onSubmitEdit}
        isLoading={isSaving}
        title={`${
          modalActionType === "agregar" ? "Agregar" : "Modificar"
        } Componentes de Bitácora`}
        initialState={planosComponentesSelected}
      />
    </>
  );
};

export default ListaBitacoraComponentes;
