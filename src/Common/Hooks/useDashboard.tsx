import { useSelector, useDispatch } from "react-redux";
import { IAppState } from "../../Store/AppStore";
import { useCallback, useMemo } from "react";
import {
  forwardUserToken,
  setLoading,
} from "../../Store/Dashboard/DashboardActionCreators";

export const useDashboard = () => {
  const dispatch = useDispatch();

  const loading = useSelector<IAppState, boolean>(
    (state) => state.dashboard.loading
  );
  const authenticated = useSelector<IAppState, boolean>(
    (state) => state.dashboard.authenticated
  );
  const locale = useSelector<IAppState, string>(
    (state) => state.dashboard.localization.locale
  );
  const messages = useSelector<IAppState, { [key: string]: string }>(
    (state) =>
      state.dashboard.localization.messages[state.dashboard.localization.locale]
  );

  const setLoadingCallback = useCallback(
    (loading: boolean) => dispatch(setLoading(loading)),
    [dispatch]
  );
  const forwardUserTokenCallback = useCallback(
    () => dispatch(forwardUserToken()),
    [dispatch]
  );

  const resultMemo = useMemo(() => {
    return {
      loading,
      authenticated,
      locale,
      messages,
      forwardUserToken: forwardUserTokenCallback,
      setLoading: setLoadingCallback,
    };
  }, [
    loading,
    authenticated,
    locale,
    messages,
    setLoadingCallback,
    forwardUserTokenCallback,
  ]);

  return resultMemo;
};
