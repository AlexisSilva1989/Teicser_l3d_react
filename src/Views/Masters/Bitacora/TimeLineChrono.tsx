import React, { useCallback, useEffect, useState } from "react";
import { Chrono, TimelineItem } from "react-chrono";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useToasts } from "react-toast-notifications";
import { useReload } from "../../../Common/Hooks/useReload";
import { IColumnasBitacora } from "../../../Data/Models/Binnacle/Binnacle";
import { AxiosError } from "axios";
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

interface Filter {
  date_from: string;
  date_to: string;
  event_types: OptionType[];
}

const EVENT_TEST: ITimeline[] = [
  {
    id: 1,
    date: "05-09-2023",
    title: "Lorem ipsum dolor sit amet",
    subtitle: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
    media: [
      {
        id: 1,
        url: "https://picsum.photos/id/908/512/512",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/674/512/512",
      },
    ],
  },
  {
    id: 2,
    date: "06-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
    media: [
      {
        id: 1,
        url: "https://picsum.photos/id/908/512/512",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/674/512/512",
      },
    ],
  },
  {
    id: 3,
    date: "07-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
    media: [
      {
        id: 1,
        url: "https://picsum.photos/id/908/512/512",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/674/512/512",
      },
    ],
  },
  {
    id: 4,
    date: "08-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
    media: [
      {
        id: 1,
        url: "https://picsum.photos/id/908/512/512",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/674/512/512",
      },
    ],
  },
  {
    id: 5,
    date: "09-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
    media: [
      {
        id: 1,
        url: "https://picsum.photos/id/908/512/512",
      },
      {
        id: 2,
        url: "https://picsum.photos/id/674/512/512",
      },
    ],
  },
  {
    id: 6,
    date: "10-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 7,
    date: "11-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 8,
    date: "12-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 9,
    date: "13-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 10,
    date: "14-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
];

const EVENT_TYPE_TEST = [
  {
    id: 1,
    nombre: "Mantención mayor",
  },
  {
    id: 2,
    nombre: "Mantención de servicio",
  },
  {
    id: 3,
    nombre: "Medición laser",
  },
  {
    id: 4,
    nombre: "Fractura/s",
  },
  {
    id: 5,
    nombre: "Desprendimientos",
  },
  {
    id: 6,
    nombre: "Corte de pernos",
  },
];

const CHRONO_DIRECTION = {
  vertical: "VERTICAL_ALTERNATING",
  horizontal: "HORIZONTAL",
};

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
  });
  const [timelineDirection, setTimelineDirection] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  const parseEventsToChronoItems = (data: ITimeline[]): CardContent[] => {
    return data.map((event) => ({
      id: event.id.toString(),
      title: event.date,
      cardTitle: event.title,
      // url: "http://www.history.com",
      cardSubtitle: event.subtitle,
      cardDetailedText: event.description,
      // media: {
      //   type: "IMAGE",
      //   source: {
      //     url: "https://picsum.photos/512/512",
      //   },
      // },
      images: event?.media,
    }));
  };

  const fetch = useCallback(async () => {
    setIsLoading(true);
    await ax
      .get("timeline", {
        params: filter,
      })
      .then((response) => {
        const { data }: { data: ITimeline[] } = response;

        doReload();
      })
      .catch((e: AxiosError) => {
        setEvents(parseEventsToChronoItems(EVENT_TEST));
        if (e.response) {
          addToast(caps("errors:base.get", { element: "los eventos" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filter]);

  useEffect(() => {
    fetch();
  }, [filter]);

  return (
    <div className="p-3 bg-white" style={{ width: "100%" }}>
      <Row>
        <Col sm={12}>
          <Row className="mb-4">
            <Col>
              <h3>Timeline</h3>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col
              sm="12"
              className="d-flex justify-content-end align-items-start"
              style={{
                gap: 8,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 189.32,
                }}
              >
                <ApiSelect
                  label="Linea de trabajo"
                  name="workline"
                  source={"linea_tiempos/select"}
                  selector={(option: any) => ({
                    label: option.nombre,
                    value: option.id,
                  })}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 189.32,
                }}
              >
                <ApiSelect
                  label="Equipo"
                  name="equipment"
                  source={"equipos/select"}
                  selector={(option: any) => ({
                    label: option.nombre,
                    value: option.id,
                  })}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: 189.32,
                }}
              >
                <ApiSelect
                  label="Componente"
                  name="component"
                  source={"componentes_planos/select"}
                  selector={(option: any) => ({
                    label: option.nombre,
                    value: option.id,
                  })}
                />
              </div>
              <div style={{ width: "100%", maxWidth: 132 }}>
                <Datepicker
                  label="Fecha desde"
                  name="dateFrom"
                  value={filter.date_from}
                  onChange={(date) =>
                    setFilter((state) =>
                      $u(state, {
                        date_from: { $set: date },
                      })
                    )
                  }
                />
              </div>

              <div style={{ width: "100%", maxWidth: 132 }}>
                <Datepicker
                  label="Fecha hasta"
                  name="dateTo"
                  value={filter.date_to}
                  onChange={(date) =>
                    setFilter((state) =>
                      $u(state, {
                        date_to: { $set: date },
                      })
                    )
                  }
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col sm="12" md="3">
              <Switch
                status={timelineDirection === "vertical"}
                title="Vertical"
                onChange={(data: any) => {
                  console.log({ data });
                  setTimelineDirection(data ? "vertical" : "horizontal");
                  doReload();
                }}
              />
            </Col>
            <Col
              sm="12"
              md={{ span: 8, offset: 1 }}
              lg={{ span: 6, offset: 3 }}
              className="d-flex justify-content-end align-items-start"
              style={{
                gap: 8,
              }}
            >
              {/* <div className="w-100">
                <label>
                  <b>Tipos de eventos:</b>
                </label>
                <Select
                  options={EVENT_TYPE_TEST.map((option) => ({
                    label: option.nombre,
                    value: option.id,
                  }))}
                  selector={(option: any) => ({
                    label: option.nombre,
                    value: option.id.toString(),
                  })}
                  onChange={(data: any) => {
                    console.log({ data });
                    setFilter((state) => ({
                      ...state,
                      eventTypes: data,
                    }));
                  }}
                  value={filter.eventTypes}
                  className="mb-0"
                  isMulti
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "calc(1.5em + 1.25rem + 1.75px)",
                      borderColor: "#e3eaef",
                      borderRadius: "0.25rem",
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      div: { padding: 5 },
                    }),
                  }}
                />
              </div> */}
              <ApiSelectMultiple
                source={"tipo_eventos/select"}
                selector={(option: any) => ({
                  label: option.nombre,
                  value: option.id.toString(),
                })}
                onChange={(data: any) => {
                  console.log({ data });
                  setFilter((state) => ({
                    ...state,
                    event_types: data,
                  }));
                }}
                value={filter.event_types}
              />
            </Col>
            {/* <Col>
                <Switch
                  status={filter.isVertical}
                  title="Vertical"
                  onChange={(data: any) => {
                    console.log({ data });
                    setFilter((state) =>
                      $u(state, {
                        isVertical: {
                          $set: data,
                        },
                      })
                    );
                  }}
                />
              </Col> */}
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
                    cardHeight={196}
                    cardWidth={196}
                    allowDynamicUpdate
                  >
                    {events.map((event) => (
                      <TimeLineCardContent event={event} />
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
