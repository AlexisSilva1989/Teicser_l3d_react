import { useCallback, useMemo } from "react";
import { useFullLocation } from "./useFullLocation";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";

export const useCommonRoutes = () => {
  const { pushTo, history } = useFullLocation();
  const { capitalize: caps, intl, localize } = useFullIntl();

  const goBackCallback = useCallback(() => history.goBack(), [history]);
  const gotoAddCallback = useCallback(
    (state?: any) => pushTo("routes:meta.add", state),
    [pushTo]
  );
  //const gotoModifyCallback = useCallback((state?: any) => pushTo('routes:meta.modify', state), [pushTo]);
  const gotoDetailsCallback = useCallback(
    (state?: any) => pushTo("routes:meta.details", state),
    [pushTo]
  );

  const gotoModifyCallback = useCallback(
    (state?: any, innerPath?: string) => {
      const nUrl = innerPath
        ? localize("routes:meta.inner_modify", { element: localize(innerPath) })
        : localize("routes:meta.modify");

      pushTo(nUrl, state);
    },
    [pushTo]
  );

  const resultMemo = useMemo(() => {
    return {
      goBack: goBackCallback,
      gotoAdd: gotoAddCallback,
      gotoModify: gotoModifyCallback,
      gotoDetails: gotoDetailsCallback,
    };
  }, [
    goBackCallback,
    gotoAddCallback,
    gotoModifyCallback,
    gotoDetailsCallback,
  ]);

  return resultMemo;
};
