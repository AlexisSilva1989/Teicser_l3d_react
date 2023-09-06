export interface JSONObject {
  [x: string]: unknown;
}

export interface Attachment {
  data: File;
  url?: string;
  id?: number;
  type?: "image" | "application";
  extension?: string;
  action?: "add" | "delete" | "keep";
}
