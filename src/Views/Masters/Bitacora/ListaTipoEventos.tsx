import React, { useCallback, useEffect, useState } from "react";
import { ListaBase } from "../../Common/ListaBase";
import { $u } from "../../../Common/Utils/Reimports";
import { ApiSelect } from "../../../Components/Api/ApiSelect";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { useShortModal } from "../../../Common/Hooks/useModal";
import { useReload } from "../../../Common/Hooks/useReload";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useToasts } from "react-toast-notifications";
import Axios, { AxiosError } from "axios";
import { IDataColumnComponentesPlano } from "../../../Data/Models/ComponentesPlano/componentes_plano";
import {
  BitacoraComponentesColumns,
  BitacoraComponentesForm,
} from "../../../Data/Models/Binnacle/BitacoraComponentes";
import TipoEventosFormModal from "../../../Components/Modals/TipoEventosFormModal";
import {
  ITypeEventsColumns,
  TypeEventsColumns,
  TypeEventsForm,
} from "../../../Data/Models/Binnacle/TypeEvents";

const ListaTipoEventos = () => {
  const { capitalize: caps } = useFullIntl();
  const [reload, doReload] = useReload();
  const modalTipoEventos = useShortModal();
  const { addToast } = useToasts();
  const source = Axios.CancelToken.source();

  const [filter, setFilter] = useState<{
    // ubicacion?: string;
    // fabricante?: string;
    // equipo?: string;
    status?: string;
  }>({
    // ubicacion: "-1",
    // fabricante: "-1",
    // equipo: "-1",
    status: "-1",
  });
  const [modalActionType, setModalActionType] = useState<"agregar" | "editar">(
    "agregar"
  );
  const [tipoEventoSelected, setTipoEventoSelected] = useState<
    IDataColumnComponentesPlano | undefined
  >();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [list, setList] = useState<TypeEventsColumns[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const modals = [
    {
      label: "Agregar",
      action: () => {
        setTipoEventoSelected(undefined);
        setModalActionType("agregar");
        modalTipoEventos.show();
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
      .get("tipo_eventos", {
        params: {
          ...filter,
          // ubicacion: filter.ubicacion === "-1" ? undefined : filter.ubicacion,
          // fabricante:
          //   filter.fabricante === "-1" ? undefined : filter.fabricante,
          // equipo: filter.equipo === "-1" ? undefined : filter.equipo,
          status: filter.status === "-1" ? undefined : filter.status,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        const { data }: { data: TypeEventsColumns[] } = response;

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
        }
        // setIsLoading(false);
      })
      .finally(() => {});
  }, [filter]);

  /*HANDLES */
  const onSubmitAdd = async (data: TypeEventsForm) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    formData.append("nombre", data.nombre);
    formData.append("jerarquia", data.jerarquia);

    setIsSaving(true);
    await ax
      .post("tipo_eventos", formData, headers)
      .then((response) => {
        modalTipoEventos.hide();
        getList();
        doReload();
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.post", { element: "tipo de eventos" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const onSubmitEdit = async (data: TypeEventsForm) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("id_tipo_evento", data.id);
    formData.append("nombre", data.nombre);
    formData.append("jerarquia", data.jerarquia);
    formData.append("status", data.status || "0");

    setIsSaving(true);
    await ax
      .patch("tipo_eventos", formData, headers)
      .then((response) => {
        modalTipoEventos.hide();
        getList();
        doReload();
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.post", { element: "tipo de eventos" }), {
            appearance: "error",
            autoDismiss: true,
          });
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
      <ListaBase<TypeEventsColumns>
        title="titles:type_events"
        source={list}
        permission="masters"
        columns={ITypeEventsColumns}
        isRemoveAddButon
        modals={modals}
        reload={reload}
        loading={isLoading}
        onSelectWithModal={(data: any) => {
          setTipoEventoSelected(data);
          setModalActionType("editar");
          modalTipoEventos.show();
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
        {/* <ApiSelect
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
        /> */}
      </ListaBase>
      <TipoEventosFormModal
        show={modalTipoEventos.visible}
        hide={modalTipoEventos.hide}
        size="sm"
        modalType={modalActionType}
        onSubmit={modalActionType === "agregar" ? onSubmitAdd : onSubmitEdit}
        isLoading={isSaving}
        title={`${
          modalActionType === "agregar" ? "Agregar" : "Modificar"
        } Tipo de evento`}
        initialState={tipoEventoSelected}
      />
    </>
  );
};

export default ListaTipoEventos;
