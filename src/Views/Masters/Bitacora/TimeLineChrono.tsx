import React, { useCallback, useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useToasts } from "react-toast-notifications";
import { useReload } from "../../../Common/Hooks/useReload";
import { IColumnasBitacora } from "../../../Data/Models/Binnacle/Binnacle";
import { AxiosError } from "axios";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { LoadingSpinner } from "../../../Components/Common/LoadingSpinner";
import { Col, Row } from "react-bootstrap";
import Switch from "../../../Components/Forms/Switch";
import { $u } from "../../../Common/Utils/Reimports";
import { ITimeline } from "../../../Data/Models/Binnacle/Timeline";
import { Datepicker } from "../../../Components/Forms/Datepicker";
import dayjs from "dayjs";
import { ApiSelect, OptionType } from "../../../Components/Api/ApiSelect";
import Select from "react-select";

interface Filter {
  dateFrom: string;
  dateTo: string;
  eventTypes: { label: string; value: number }[] | null;
}

const EVENT_TEST: ITimeline[] = [
  {
    id: 1,
    date: "05-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 2,
    date: "06-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 3,
    date: "07-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 4,
    date: "08-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
  },
  {
    id: 5,
    date: "09-09-2023",
    title: "Lorem ipsum dolor sit amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut. Eleifend donec pretium vulputate sapien nec. Eu feugiat pretium nibh ipsum consequat nisl vel. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Venenatis tellus in metus vulputate. Eu sem integer vitae justo eget. Tellus cras adipiscing enim eu turpis egestas. Elit ullamcorper dignissim cras tincidunt. Duis tristique sollicitudin nibh sit amet commodo nulla. Enim diam vulputate ut pharetra sit amet aliquam id. A diam maecenas sed enim. Ut lectus arcu bibendum at varius vel pharetra vel.",
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
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>({
    dateFrom: dayjs().subtract(3, "month").format("DD-MM-YYYY"),
    dateTo: dayjs().add(3, "month").format("DD-MM-YYYY"),
    eventTypes: [],
  });

  const parseEventsToChronoItems = (data: ITimeline[]) => {
    return data.map((event) => ({
      title: event.date,
      cardTitle: event.title,
      // url: "http://www.history.com",
      cardSubtitle: event.subtitle,
      cardDetailedText: event.description,
      media: {
        type: "IMAGE",
        source: {
          url: "https://picsum.photos/512/512",
        },
      },
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
    <div style={{ width: "100%", height: "900px" }}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Row className="p-3 bg-white">
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
                <div className="w-100">
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
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 189.32,
                  }}
                >
                  <ApiSelect
                    label="Linea de tiempo"
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
                    value={filter.dateFrom}
                    onChange={(date) =>
                      setFilter((state) =>
                        $u(state, {
                          dateFrom: { $set: date },
                        })
                      )
                    }
                  />
                </div>

                <div style={{ width: "100%", maxWidth: 132 }}>
                  <Datepicker
                    label="Fecha hasta"
                    name="dateTo"
                    value={filter.dateTo}
                    onChange={(date) =>
                      setFilter((state) =>
                        $u(state, {
                          dateTo: { $set: date },
                        })
                      )
                    }
                  />
                </div>
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
            <Row>
              <Col>
                <Chrono
                  items={events}
                  mode={CHRONO_DIRECTION["horizontal"]}
                  showAllCardsHorizontal
                  cardHeight={196}
                  cardWidth={256}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default TimeLineChrono;
