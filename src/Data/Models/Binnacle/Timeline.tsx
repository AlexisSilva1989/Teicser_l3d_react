import { TimelineItem } from "react-chrono";

export interface ITimeline {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  media?: IMediaTimeline[];
}

export interface IMediaTimeline {
  id: number;
  url: string;
}

export interface CardContent extends TimelineItem {
  images?: IMediaTimeline[];
}
