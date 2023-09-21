import { TimelineItem } from "react-chrono";

export interface ComponentsTimelineCard {
  id: number;
  name: string;
  is_full_part: number;
  part_number: string;
}

export interface ITimeline {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  media?: IMediaTimeline[];
  components?: ComponentsTimelineCard[];
}

export interface IMediaTimeline {
  id: number;
  url: string;
}

export interface CardContent extends TimelineItem {
  images?: IMediaTimeline[];
  components?: ComponentsTimelineCard[];
}
