import { useIntl } from "react-intl";
import { useCallback, useMemo } from "react";
import { Format } from "../../Dtos/Utils";
import { $v } from "../Utils/Reimports";

export const useFullIntl = () => {
  const intl = useIntl();
  const localizeMemo = useMemo(() => Format.localizeIntl(intl), [intl]);
  const capitalizeCallback = useCallback(
    (id: string, args?: any) => $v.capitalize(localizeMemo(id, args)),
    [localizeMemo]
  );

  const resultMemo = useMemo(() => {
    return { intl, localize: localizeMemo, capitalize: capitalizeCallback };
  }, [intl, localizeMemo, capitalizeCallback]);

  return resultMemo;
};
