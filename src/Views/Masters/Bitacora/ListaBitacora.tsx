import React, { useCallback, useState } from "react";
import { ListaBase } from "../../Common/ListaBase";
import { $j, $u } from "../../../Common/Utils/Reimports";
import { ApiSelect } from "../../../Components/Api/ApiSelect";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { useShortModal } from "../../../Common/Hooks/useModal";
import { useReload } from "../../../Common/Hooks/useReload";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useToasts } from "react-toast-notifications";
import { AxiosError } from "axios";
import {
  BitacoraColumns,
  IColumnasBitacora,
  IDataFormBitacora,
} from "../../../Data/Models/Binnacle/Binnacle";
import BitacoraFormModal from "../../../Components/Modals/BitacoraFormModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Datepicker } from "../../../Components/Forms/Datepicker";

interface FilterBitacora {
  status: string;
  type: string;
  date: string;
  equipment: string;
  location: string;
  component: string;
}

const EVENT_TEST = [
  {
    id: 1,
    status: 1,
    title: "Titulo1",
    description: "Descripcion 1",
    type: { id: 1, name: "Tipo 1" },
    date: "05-09-2023",
    equipment: { id: 2, name: "Equipo 2" },
    location: [{ value: "2", label: "Ubicacion 2" }],
    components: [
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterBitacora>({
    status: "-1",
    type: "-1",
    date: "-1",
    equipment: "-1",
    location: "-1",
    component: "-1",
  });
  const [modalActionType, setModalActionType] = useState<"agregar" | "editar">(
    "agregar"
  );
  const [binnacleSelected, setBinnacleSelected] = useState<
    IColumnasBitacora | undefined
  >();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleStatusChange = async (eventId: number, status: number) => {
    setIsLoading(true);
    await ax
      .delete(`bitacora`, { params: { eventId, status } })
      .then((response) => {
        doReload();
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
      });
  };

  const handleDeleteEvent = async (eventId: number) => {
    setIsLoading(true);
    await ax
      .delete(`bitacora`, { params: { eventId } })
      .then((response) => {
        doReload();
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
          {event.status && event.status === 1 ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-preview-${event.id}`}>
                  {caps("labels:meta.comprob")}
                </Tooltip>
              }
            >
              <i
                className="fas fa-eye"
                style={{ cursor: "pointer", color: "var(--info)" }}
                onClick={() =>
                  handleStatusChange(event.id, event.status ? 0 : 1)
                }
              />
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-preview-${event.id}`}>
                  {caps("labels:meta.comprob")}
                </Tooltip>
              }
            >
              <i
                className="fas fa-eye-slash"
                style={{ cursor: "pointer", color: "var(--info)" }}
                onClick={() =>
                  handleStatusChange(event.id, event.status ? 0 : 1)
                }
              />
            </OverlayTrigger>
          )}
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-preview-${event.id}`}>
                {caps("labels:meta.comprob")}
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

  const customFilter = useCallback(
    (evento: IColumnasBitacora): boolean => {
      const isFilterByStatus: boolean =
        filter.status == "-1" || evento.status?.toString() == filter.status;
      return isFilterByStatus;
    },
    [filter]
  );

  /*HANDLES */
  const onSubmitAdd = async (data: IDataFormBitacora) => {
    console.log({
      files: data.files?.filter((file) => !file.data),
    });
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("title", data.title);
    data.description && formData.append("description", data.description);
    data.description && formData.append("date", data.date);
    formData.append("type", data.type.toString());
    formData.append("equipment", data.equipment.toString());
    formData.append("location", data.location.toString());
    formData.append("components", JSON.stringify(data.components));
    data.files?.forEach((file) => {
      file.data &&
        file.action === "add" &&
        formData.append("files[]", file.data);
    });

    setIsSaving(true);
    await ax
      .post("bitacora", formData, headers)
      .then((response) => {
        modalBitacoraEvent.hide();
        doReload();
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

  const onSubmitEdit = async (data: IDataFormBitacora) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    formData.append("title", data.title);
    data.description && formData.append("description", data.description);
    data.description && formData.append("date", data.date);
    formData.append("type", data.type.toString());
    formData.append("equipment", data.equipment.toString());
    formData.append("location", data.location.toString());
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

    setIsSaving(true);
    await ax
      .patch("bitacora", formData, headers)
      .then((response) => {
        modalBitacoraEvent.hide();
        doReload();
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

  return (
    <>
      <ListaBase<IColumnasBitacora>
        title="titles:binnacle"
        // source={$j("bitacora")}
        source={EVENT_TEST}
        permission="masters"
        columns={columns}
        customFilter={customFilter}
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
            setFilter((s) => $u(s, { location: { $set: data } }));
          }}
        />
        <ApiSelect<{ id: number; nombre: string }>
          name="component"
          label="Componente"
          source={$j("/componentes_planos/select")}
          value={filter.component}
          selector={(option) => {
            return { value: option.id.toString(), label: option.nombre };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { component: { $set: data } }));
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
