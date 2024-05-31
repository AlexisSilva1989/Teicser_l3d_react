import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { BaseContentView } from "../Common/BaseContentView";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import "moment/locale/es";

type defaultView = "month" | "day" | "week";

type EventsType = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean | undefined;
  resource?: any;
};

interface Props {
  events?: Array<EventsType>;
  defaultView?: defaultView;
  styles?: React.CSSProperties;
  setNewEvent?: (event: any) => void;
  getEvent?: (event: any) => void;
}

//configuración del componente Calendar
const localizer = momentLocalizer(moment);

const configLenguage = {
  next: "sig",
  previous: "ant",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
};

const styleInit: React.CSSProperties = {
  width: "100%",
  height: "80vh",
};

const initialEventsList = [
  {
    title: "evento de prueba",
    start: new Date(),
    end: new Date(),
    allDay: true,
  },
  {
    title: "evento inicial",
    start: new Date(2021, 4, 25),
    end: new Date(2021, 5, 25),
    allDay: false,
  },
];

export const CustomCalendar = (props: Props) => {
  const [events, setEvents] = useState<Array<EventsType>>(initialEventsList);

  //PARA CREAR NUEVOS EVENTOS EN EL CALENDARIO...
  const newEventTest = (e: any) => {
    const title = window.prompt("New Event name");

    if (title) {
      setEvents([
        ...events,
        {
          title,
          start: e.start,
          end: e.end,
          allDay: true,
        },
      ]);
    }
  };

  //PARA OPTENER INFORMACIÓN DEL EVENTO AL HACER CLICK EN EL CALENDARIO....
  const getEventTest = (e: any) => console.log(e);

  return (
    <BaseContentView title="Calendario de eventos">
      <Col sm={12} className="mb-3">
        <Calendar
          localizer={localizer}
          events={events}
          selectable
          views={["month", "day", "week"]}
          startAccessor="start"
          endAccessor="end"
          defaultDate={new Date()}
          defaultView={"month"}
          style={styleInit}
          messages={configLenguage}
          //evento para agregar nuevo evento
          onSelectSlot={props.setNewEvent}
          //para optener detalle del evento seleccionado
          onSelectEvent={props.getEvent}
        />
      </Col>
    </BaseContentView>
  );
};
