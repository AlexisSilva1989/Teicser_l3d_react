import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Chrono, TimelineItem } from "react-chrono";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useToasts } from "react-toast-notifications";
import { useReload } from "../../../Common/Hooks/useReload";
import { IColumnasBitacora } from "../../../Data/Models/Binnacle/Binnacle";
import Axios, { AxiosError } from "axios";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { LoadingSpinner } from "../../../Components/Common/LoadingSpinner";
import { Card, Col, Row } from "react-bootstrap";
import Switch from "../../../Components/Forms/Switch";
import { $u } from "../../../Common/Utils/Reimports";
import {
  CardContent,
  IMediaTimeline,
  ITimeline,
} from "../../../Data/Models/Binnacle/Timeline";
import { Datepicker } from "../../../Components/Forms/Datepicker";
import dayjs from "dayjs";
import { ApiSelect, OptionType } from "../../../Components/Api/ApiSelect";
import Select from "react-select";
import TimeLineCardContent from "./TimeLineCardContent";
import ApiSelectMultiple from "../../../Components/Api/ApiSelectMultiple";
import { useMedia } from "react-use";

interface Filter {
  date_from: string;
  date_to: string;
  event_types: OptionType[];
  location: OptionType[];
  components: OptionType[];
  equipment: number;
  workline: number;
}

const CHRONO_DIRECTION = {
  vertical: "VERTICAL_ALTERNATING",
  horizontal: "HORIZONTAL",
};

const EVENT_TYPES_LEVELS: { [key: number]: number[] } = {
  1: [1, 2, 3],
  2: [1, 2, 3],
  3: [1, 2],
  4: [1],
  5: [1],
  6: [1],
};

const TEST = [
  {
    id: 2,
    // title: "Febrero 2021",
    date: "2021-01-01",
    events: [
      {
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        // media: [
        //   {
        //     id: 1,
        //     url: "https://picsum.photos/512/512",
        //   },
        // ],
        components: [
          {
            id: 1,
            name: "Componente 1",
            is_full_part: 1,
            part_number: "123456",
          },
          {
            id: 2,
            name: "Componente 2",
            is_full_part: 0,
            part_number: "123456",
          },
        ],
      },
      {
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        // media: [
        //   {
        //     id: 1,
        //     url: "https://picsum.photos/512/512",
        //   },
        // ],
        components: [
          {
            id: 1,
            name: "Componente 1",
            is_full_part: 1,
            part_number: "123456",
          },
          {
            id: 2,
            name: "Componente 2",
            is_full_part: 0,
            part_number: "123456",
          },
        ],
      },
    ],
  },
];

const TimeLineChrono = () => {
  const { addToast } = useToasts();
  const [reload, doReload] = useReload();
  const { capitalize: caps } = useFullIntl();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<CardContent[]>([]);
  const [filter, setFilter] = useState<Filter>({
    date_from: dayjs().subtract(3, "month").format("DD-MM-YYYY"),
    date_to: dayjs().add(3, "month").format("DD-MM-YYYY"),
    event_types: [],
    location: [],
    components: [],
    equipment: -1,
    workline: -1,
  });
  const [timelineDirection, setTimelineDirection] = useState<
    "horizontal" | "vertical"
  >("horizontal");
  const [equipmentList, setEquipmentList] = useState([]);
  const [componentList, setComponentList] = useState([]);
  const [eventTypesList, setEventTypesList] = useState([]);

  const source = Axios.CancelToken.source();

  const getEquipmentList = async () => {
    await ax
      .get("service_render/equipos", {
        params: {
          isSelectFilter: true,
          workline:
            Number(filter.workline) !== -1 ? filter.workline : undefined,
        },
      })
      .then((response) => {
        setEquipmentList(response.data);
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
  const getComponentList = async () => {
    await ax
      .get("revestimientos/select", {
        params: {
          location:
            filter.location !== null && filter.location.length > 0
              ? filter.location.map((location) => location.value)
              : undefined,
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

  const getEventTypesList = async () => {
    await ax
      .get("tipo_eventos/select")
      .then((response) => {
        setEventTypesList(response.data);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(
            caps("errors:base.get", { element: "tipos de eventos select" }),
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        }
      })
      .finally(() => {});
  };

  const media = useMedia("(min-width: 768px)");

  const parseEventsToChronoItems = (data: ITimeline[]): CardContent[] => {
    return data.map((event) => ({
      id: event.id.toString(),
      title: event.date,
      cardTitle: event.title,
      // url: "http://www.history.com",
      cardSubtitle: event.subtitle ?? event.date,
      // cardDetailedText: event.description,
      // media: {
      //   type: "IMAGE",
      //   source: {
      //     url: "https://picsum.photos/512/512",
      //   },
      // },
      events: event?.events,
    }));
  };

  const getZoomLevel = (diffDate: number) => {
    if (diffDate >= 0 && diffDate <= 6) return 3;
    if (diffDate > 6 && diffDate < 12) return 2;
    if (diffDate >= 12) return 1;
    return 0;
  };

  const getEventTypeVisibilityByZoomLevel = (
    eventTypeId: number,
    zoomLevel: number
  ) => {
    return EVENT_TYPES_LEVELS[eventTypeId].includes(zoomLevel);
  };

  const fetch = useCallback(async () => {
    setIsLoading(true);
    await ax
      .get("timeline", {
        params: {
          ...filter,
          event_types:
            filter.event_types !== null
              ? filter.event_types.map((event) => event.value)
              : undefined,
          components:
            filter.components !== null
              ? filter.components.map((event) => event.value)
              : undefined,
          date_from: filter.date_from.split("-").reverse().join("-"),
          date_to: filter.date_to.split("-").reverse().join("-"),
        },
        cancelToken: source.token,
      })
      .then((response) => {
        const { data }: { data: ITimeline[] } = response;

        setEvents(parseEventsToChronoItems(data));

        doReload();
        setIsLoading(false);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          // setEvents(parseEventsToChronoItems(TEST));
          addToast(caps("errors:base.get", { element: "los eventos" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
        if (Axios.isCancel(e.response)) {
          // Si la solicitud fue cancelada, puedes manejarlo aquí
        }
        // setIsLoading(false);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  }, [filter]);

  useEffect(() => {
    getEquipmentList();
  }, [filter.workline]);

  useEffect(() => {
    getComponentList();
  }, [filter.location, filter.equipment]);

  useEffect(() => {
    const dateFrom = dayjs(filter.date_from.split("-").reverse().join("-"));
    const dateTo = dayjs(filter.date_to.split("-").reverse().join("-"));
    const diffDates = dateTo.diff(dateFrom, "months");
    const zoomLevel = getZoomLevel(diffDates);
    const eventsByZoomLevel = eventTypesList
      .filter((event: any) => event.jerarquia <= zoomLevel)
      .map((event: any) => ({ label: event.nombre, value: event.id }));
    setFilter((state) =>
      $u(state, {
        event_types: {
          $set: eventsByZoomLevel,
        },
      })
    );
  }, [filter.date_from, filter.date_to, eventTypesList]);

  useEffect(() => {
    if (filter.date_from !== "" && filter.date_to !== "") {
      fetch();
      return () => {
        source.cancel(
          "Solicitud cancelada debido a la desaparición del componente"
        );
      };
    }
  }, [filter]);

  useEffect(() => {
    setTimelineDirection(media ? "horizontal" : "vertical");
    getEquipmentList();
    getComponentList();
    getEventTypesList();
  }, []);

  return (
    <div className="p-3 bg-white" style={{ width: "100%" }}>
      <Row>
        <Col sm={12}>
          <Row className="mb-4">
            <Col>
              <h3>Timeline</h3>
            </Col>
          </Row>

          <Row>
            <Col sm="12" md="3" className="mb-4">
              <ApiSelect
                label="Linea de trabajo"
                name="workline"
                source={"lineas_trabajo"}
                value={filter.workline.toString()}
                selector={(option: any) => ({
                  label: option.nombre,
                  value: option.id,
                })}
                onChange={(data) => {
                  setFilter((state) =>
                    $u(state, {
                      workline: { $set: data },
                      equipment: { $set: -1 },
                    })
                  );
                }}
                firtsOptions={{
                  label: "Todos",
                  value: "-1",
                }}
              />
            </Col>
            <Col sm="12" md="3" className="mb-4">
              <ApiSelect
                label="Equipo"
                name="equipment"
                source={equipmentList}
                queryParams={{
                  workline: filter.workline,
                }}
                value={filter.equipment.toString()}
                selector={(option: any) => ({
                  label: option.nombre,
                  value: option.id,
                })}
                onChange={(date) => {
                  setFilter((state) =>
                    $u(state, {
                      equipment: { $set: date },
                    })
                  );
                }}
                firtsOptions={{
                  label: "Todos",
                  value: "-1",
                }}
              />
            </Col>
            <Col sm="12" md="3" className="mb-4">
              <Datepicker
                label="Fecha desde"
                name="dateFrom"
                value={filter.date_from}
                onChange={(data) =>
                  setFilter((state) =>
                    $u(state, {
                      date_from: { $set: data },
                    })
                  )
                }
              />
            </Col>
            <Col sm="12" md="3" className="mb-4">
              <Datepicker
                label="Fecha hasta"
                name="dateTo"
                value={filter.date_to}
                onChange={(data) =>
                  setFilter((state) =>
                    $u(state, {
                      date_to: { $set: data },
                    })
                  )
                }
              />
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="6" className="mb-4">
              <ApiSelectMultiple
                label="Ubicacion"
                source={"locations"}
                selector={(option: any) => ({
                  label: option.nombre,
                  value: option.id.toString(),
                })}
                onChange={(data: any) => {
                  setFilter((state) =>
                    $u(state, {
                      location: { $set: data },
                      components: { $set: [] },
                    })
                  );
                }}
                value={filter.location}
              />
            </Col>
            <Col sm="12" md="6" className="mb-4">
              <ApiSelectMultiple
                label="Componente"
                name="component"
                source={componentList}
                value={filter.components}
                selector={(option: any) => ({
                  label: option.nombre,
                  value: option.id,
                })}
                onChange={(data) => {
                  setFilter((state) =>
                    $u(state, {
                      components: { $set: data },
                    })
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="9" className="mb-4">
              <ApiSelectMultiple
                label="Tipos de Eventos"
                source={eventTypesList}
                selector={(option: any) => ({
                  label: option.nombre,
                  value: option.id.toString(),
                })}
                onChange={(data: any) => {
                  setFilter((state) => ({
                    ...state,
                    event_types: data,
                  }));
                }}
                value={filter.event_types}
              />
            </Col>
            <Col
              sm="12"
              md="3"
              className="d-flex justify-content-start align-items-end mb-4"
            >
              <Switch
                status={timelineDirection === "vertical"}
                title="Vertical"
                onChange={(data: any) => {
                  setTimelineDirection(data ? "vertical" : "horizontal");
                  doReload();
                }}
              />
            </Col>
          </Row>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            !reload && (
              <Row>
                <Col>
                  <Chrono
                    items={events}
                    mode={CHRONO_DIRECTION[timelineDirection]}
                    showAllCardsHorizontal
                    // cardHeight={384}
                    cardWidth={196}
                    allowDynamicUpdate
                  >
                    {events.map((event) => (
                      <TimeLineCardContent key={event.id} event={event} />
                    ))}
                  </Chrono>
                </Col>
              </Row>
            )
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TimeLineChrono;
