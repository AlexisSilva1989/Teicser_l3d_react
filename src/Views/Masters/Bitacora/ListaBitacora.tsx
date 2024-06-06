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
  BitacoraColumns,
  IColumnasBitacora,
  IDataFormBitacora,
} from "../../../Data/Models/Binnacle/Binnacle";
import BitacoraFormModal from "../../../Components/Modals/BitacoraFormModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Datepicker } from "../../../Components/Forms/Datepicker";
import dayjs from "dayjs";
import swal from "sweetalert";

interface FilterBitacora {
  is_show: string;
  type: string;
  date: string | undefined;
  equipment: string;
  location: string;
  components: string;
}

const EVENT_TEST: IColumnasBitacora[] = [
  {
    id: 1,
    // status: 1,
    title: "Titulo1",
    description: "Descripcion 1",
    tipo_evento: { id: 1, name: "Tipo 1" },
    date: "05-09-2023",
    equipo: { id: 2, name: "Equipo 2" },
    ubicaciones: [{ value: "2", label: "Ubicacion 2" }],
    componentes_planos: [
      {
        id: 4,
        has_all_parts: true,
      },
      {
        id: 13,
        has_all_parts: false,
        part_number: "64984",
      },
    ],
    files: [
      {
        id: 1,
        url: "https://picsum.photos/id/214/720/480",
        type: "image" as "image",
        extension: "png",
        action: "keep" as "keep",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/378/720/480",
        type: "application" as "application",
        extension: "pdf",
        action: "keep" as "keep",
      },
    ],
  },
];

const ListaBitacora = () => {
  const { capitalize: caps, intl } = useFullIntl();
  const [reload, doReload] = useReload();
  const modalBitacoraEvent = useShortModal();
  const { addToast } = useToasts();
  const source = Axios.CancelToken.source();

  const [hasInit, setHasInit] = useState<boolean>(false);
  const [eventList, setEventList] = useState<IColumnasBitacora[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterBitacora>({
    is_show: "-1",
    type: "-1",
    date: undefined,
    equipment: "-1",
    location: "-1",
    components: "-1",
  });
  const [modalActionType, setModalActionType] = useState<"agregar" | "editar">(
    "agregar"
  );
  const [binnacleSelected, setBinnacleSelected] = useState<
    IColumnasBitacora | undefined
  >();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [componentList, setComponentList] = useState([]);

  const getList = async () => {
    setIsLoading(true);
    await ax
      .get(`eventos_bitacora`, {
        params: {
          ...filter,
          date:
            filter.date !== undefined
              ? filter.date !== ""
                ? dayjs(filter.date.split("-").reverse().join("-")).format(
                    "YYYY-MM-DD"
                  )
                : undefined
              : filter.date,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        setEventList(response.data);
        doReload();
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          // setEventList(EVENT_TEST);
          addToast(caps("errors:base.load", { element: "Eventos" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
        if (Axios.isCancel(e.response)) {
          // Si la solicitud fue cancelada, puedes manejarlo aquí
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getComponentList = async () => {
    await ax
      .get("revestimientos/select", {
        params: {
          location:
            Number(filter.location) !== -1 ? [filter.location] : undefined,
          equipo:
            Number(filter.equipment) !== -1 ? filter.equipment : undefined,
        },
      })
      .then((response) => {
        setComponentList(response.data);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.get", { element: "equipos select" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {});
  };

  const handleIsShowChange = async (eventId: number, isShow: number) => {
    setIsLoading(true);
    await ax
      .patch(`eventos_bitacora/show`, { eventId, isShow })
      .then((response) => {
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.delete", { element: "Evento" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
        getList();
      });
  };

  const deleteEvent = async (eventId: number) => {
    setIsLoading(true);
    await ax
      .delete(`eventos_bitacora`, { params: { eventId } })
      .then((response) => {
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.delete", { element: "Evento" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
        getList();
      });
  };

  const handleDeleteEvent = async (eventId: number) => {
    swal({
      // title: "Está seguro de cambiar este campo?",
      text: caps("messages:confirmations.on_remove_permanent_element"),
      icon: "warning",
      className: "swal-text-justify",
      buttons: ["Cancelar", "Si, estoy seguro"],
    }).then((result: any) => {
      if (result) {
        deleteEvent(eventId);
      }
    });
  };

  const columns = BitacoraColumns([
    // {
    //   selector: "components",
    //   name: caps("columns:component"),
    // },
    {
      name: caps("columns:actions"),
      style: {
        display: "flex",
        gap: "8px",
      },
      cell: (event) => (
        <>
          {event.show === 1 ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-preview-${event.id}`}>
                  {caps("¿Es visible en timeline?")}
                </Tooltip>
              }
            >
              <i
                className="fas fa-eye"
                style={{ cursor: "pointer", color: "var(--info)" }}
                onClick={() =>
                  handleIsShowChange(event.id, event.show === 1 ? 0 : 1)
                }
              />
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-preview-${event.id}`}>
                  {caps("¿Es visible en timeline?")}
                </Tooltip>
              }
            >
              <i
                className="fas fa-eye-slash"
                style={{ cursor: "pointer", color: "var(--info)" }}
                onClick={() =>
                  handleIsShowChange(event.id, event.show === 1 ? 0 : 1)
                }
              />
            </OverlayTrigger>
          )}
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-preview-${event.id}`}>
                {caps("Eliminar evento")}
              </Tooltip>
            }
          >
            <i
              className="fas fa-times-circle"
              style={{ cursor: "pointer", color: "var(--danger)" }}
              onClick={() => handleDeleteEvent(event.id)}
            />
          </OverlayTrigger>
        </>
      ),
    },
  ]);

  const modals = [
    {
      label: "Agregar",
      action: () => {
        setBinnacleSelected(undefined);
        setModalActionType("agregar");
        modalBitacoraEvent.show();
      },
      className: "btn-primary",
    },
  ];

  // const customFilter = useCallback(
  //   (evento: IColumnasBitacora): boolean => {
  //     const isFilterByShow: boolean =
  //       filter.is_show == "-1" || evento.is_show?.toString() == filter.is_show;
  //     return isFilterByStatus;
  //   },
  //   [filter]
  // );

  /*HANDLES */
  const onSubmitAdd = async (data: IDataFormBitacora) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    data.description && formData.append("description", data.description);
    data.date &&
      formData.append(
        "date",
        dayjs(data.date.split("-").reverse().join("-")).format("YYYY-MM-DD")
      );
    formData.append("type", data.type.toString());
    formData.append("equipment", data.equipment.toString());
    formData.append("components", JSON.stringify(data.components));
    data.files?.forEach((file) => {
      file.data &&
        file.action === "add" &&
        formData.append("files[]", file.data);
    });
    // formData.append(
    //   "location",
    //   JSON.stringify(data.location.map((item) => item.value))
    // );

    setIsSaving(true);
    await ax
      .post("eventos_bitacora", formData, headers)
      .then((response) => {
        modalBitacoraEvent.hide();
        getList();
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.post", { element: "evento" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const onSubmitEdit = async (data: IDataFormBitacora) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };


    formData.append("id", data.id.toString());
    data.description && formData.append("description", data.description);
    data.date &&
      formData.append(
        "date",
        dayjs(data.date.split("-").reverse().join("-")).format("YYYY-MM-DD")
      );
    formData.append("type", data.type.toString());
    formData.append("equipment", data.equipment.toString());
    formData.append("components", JSON.stringify(data.components));
    data.files?.forEach((file) => {
      file.data &&
        file.action === "add" &&
        formData.append("files[]", file.data);
    });
    data.files &&
      formData.append(
        "files_raw",
        JSON.stringify(data.files?.filter((file) => file.action !== "add"))
      );
    // formData.append(
    //   "location",
    //   JSON.stringify(data.location.map((item) => item.value))
    // );
    formData.append("show", data?.show ?? "0");

    setIsSaving(true);
    await ax
      .patch("eventos_bitacora", formData, headers)
      .then((response) => {
        modalBitacoraEvent.hide();
        getList();
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.post", { element: "evento" }), {
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
    // getList();
    getComponentList();
    // setHasInit(true);
    // return () => {
    //   source.cancel(
    //     "Solicitud cancelada debido a la desaparición del componente"
    //   );
    // };
  }, []);

  useEffect(() => {
    getList();

    return () => {
      source.cancel(
        "Solicitud cancelada debido a la desaparición del componente"
      );
    };
  }, [
    filter.components,
    filter.date,
    filter.equipment,
    filter.is_show,
    filter.type,
  ]);

  useEffect(() => {
    (Number(filter.location) !== null || Number(filter.equipment !== null)) &&
      getComponentList();
  }, [filter.location, filter.equipment]);

  return (
    <>
      <ListaBase<IColumnasBitacora>
        title="titles:binnacle"
        source={eventList}
        // source={EVENT_TEST}
        permission="masters"
        columns={columns}
        // customFilter={customFilter}
        isRemoveAddButon
        modals={modals}
        reload={reload}
        loading={isLoading}
        onSelectWithModal={(data: any) => {
          setBinnacleSelected(data);
          setModalActionType("editar");
          modalBitacoraEvent.show();
        }}
      >
        <ApiSelect<{ nombre: string; id: number }>
          name="type"
          label="Tipo de evento"
          source={$j("tipo_eventos/select")}
          value={filter.type}
          selector={(option) => {
            return { label: option.nombre, value: option.id.toString() };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { type: { $set: data } }));
          }}
          firtsOptions={{
            label: "Todos",
            value: "-1",
          }}
        />

        <ApiSelect<{ id: number; nombre: string }>
          name="equipment"
          label="Equipo"
          source={$j("service_render/equipos")}
          value={filter.equipment}
          selector={(option) => {
            return { label: option.nombre, value: option.id.toString() };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { equipment: { $set: data } }));
          }}
          firtsOptions={{
            label: "Todos",
            value: "-1",
          }}
        />
        <ApiSelect<{ nombre: string; id: string }>
          name="location"
          label="Ubicación"
          source={$j("locations")}
          value={filter.location}
          selector={(option) => {
            return { label: option.nombre, value: option.id.toString() };
          }}
          onChange={(data) => {
            setFilter((s) =>
              $u(s, { location: { $set: data }, components: { $set: "-1" } })
            );
          }}
          firtsOptions={{
            label: "Todas",
            value: "-1",
          }}
        />
        <ApiSelect<{ id: number; nombre: string }>
          name="component"
          label="Componente"
          source={componentList}
          value={filter.components}
          selector={(option) => {
            return { value: option.id.toString(), label: option.nombre };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { components: { $set: data } }));
          }}
          firtsOptions={{
            label: "Todos",
            value: "-1",
          }}
        />
        <ApiSelect<{ label: string; value: string }>
          name="is_show"
          label="¿Es Visible?"
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
          value={filter.is_show}
          selector={(option) => {
            return { label: option.label, value: option.value };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { is_show: { $set: data } }));
          }}
        />
        <Datepicker
          name="date"
          label="Fecha"
          value={filter.date}
          onChange={(data) => {
            setFilter((s) => $u(s, { date: { $set: data } }));
          }}
        />
      </ListaBase>
      <BitacoraFormModal
        show={modalBitacoraEvent.visible}
        hide={modalBitacoraEvent.hide}
        size="lg"
        modalType={modalActionType}
        onSubmit={modalActionType === "agregar" ? onSubmitAdd : onSubmitEdit}
        isLoading={isSaving}
        title={`${
          modalActionType === "agregar" ? "Agregar" : "Modificar"
        } Evento`}
        initialState={binnacleSelected}
      />
    </>
  );
};

export default ListaBitacora;
