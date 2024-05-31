import { IntlShape } from "react-intl";
import { IDataTableColumn } from "react-data-table-component";

export type LocalizedColumnsCallback<T> = (
  intl: IntlShape,
  extraColumns?: IDataTableColumn<T>[]
) => IDataTableColumn<T>[];
export type ParamsColumnsCallback<T, U = any> = (
  intl: IntlShape,
  params: U
) => IDataTableColumn<T>[];

export type ColumnsPipe<T> = (
  caps: (e: string) => string
) => IDataTableColumn<T>[];
