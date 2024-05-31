import { useFullIntl } from "./useFullIntl";
import { useMemo } from "react";
import {
  LocalizedColumnsCallback,
  ColumnsPipe,
} from "../Utils/LocalizedColumnsCallback";
import { useLocalization } from "./useLocalization";

export const useColumns = <T extends unknown>(
  localizeColumns: LocalizedColumnsCallback<T>
) => {
  const { intl } = useFullIntl();
  const columns = useMemo(() => localizeColumns(intl), [localizeColumns, intl]);

  return columns;
};

export const useLocalizedColumns = <T extends unknown>(
  columns: ColumnsPipe<T>
) => {
  const { column, capitalize } = useLocalization();

  const localizedColumns = useMemo(() => {
    return columns(capitalize).map((col) => {
      return { ...col, name: column(col.name as string) };
    });
  }, [capitalize, columns, column]);

  return localizedColumns;
};
