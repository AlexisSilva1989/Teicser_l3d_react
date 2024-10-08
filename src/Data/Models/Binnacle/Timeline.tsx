import { TimelineItem } from "react-chrono";

export interface ComponentsTimelineCard {
  id: number;
  name: string;
  is_full_part: number;
  part_number: string;
  location: string;
}

export interface EventsTimelineCard {
  title: string;
  equipment: string;
  media?: IMediaTimeline[];
  components?: ComponentsTimelineCard[];
  description: string;
}

export interface ITimeline {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
  date: string;
  media?: IMediaTimeline[];
  components?: ComponentsTimelineCard[];
  events?: EventsTimelineCard[];
}

export interface IMediaTimeline {
  id: number;
  url: string;
}

export interface Media {
  type: string; // o 'IMAGE' si es un valor fijo
  source: {
      url: string; // Debe ser un string
  }
}

export interface CardContent extends TimelineItem {
  events?: EventsTimelineCard[];
  media?: Media[]; // Asegúrate de que esto sea un array
}
