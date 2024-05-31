import { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { ax } from "../Utils/AxiosCustom";
import { useCallback, useMemo } from "react";
import { useNotifications } from "./useNotifications";
import { useToasts } from "react-toast-notifications";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { Utils } from "../../Common/Utils/Utils";

export const useApi = (api: AxiosInstance = ax) => {
  const { push } = useNotifications();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();

  const getCallback = useCallback(
    <T extends unknown>(url: string, config?: AxiosRequestConfig) => {
      return {
        success: (dataCallback: (e: T) => void) => {
          return {
            fail: async (error: string | null, action?: () => void) => {
              await api
                .get(url, config)
                .then((e) => {
                  dataCallback(e.data);
                  /*
							addToast(caps('success:base.success'), {
								appearance: 'success',
								autoDismiss: true,
							});*/
                })
                .catch((e: AxiosError<T>) => {
                  if (error == null) {
                    return;
                  }

                  addToast(error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                  if (action) action();
                  //push.error('errors:' + error, params ?? { code: e.response?.status });
                });
            },
          };
        },
      };
    },
    [api, push]
  );

  const postCallback = useCallback(
    <T extends unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ) => {
      return {
        success: (dataCallback?: (e: T) => void) => {
          return {
            fail: async (error: string, params?: any, action?: () => void) => {
              await api
                .post(url, data, config)
                .then((e) => {
                  if (dataCallback) {
                    dataCallback(e.data);

                    addToast(caps("success:base.success"), {
                      appearance: "success",
                      autoDismiss: true,
                    });
                  }
                })
                .catch((e: AxiosError<T>) => {
                  addToast(error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                  if (action) action();
                  ////push.error('errors:' + error, params ?? { code: e.response?.status });
                });
            },
          };
        },
      };
    },
    [api, push]
  );

  const patchCallback = useCallback(
    <T extends unknown>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig
    ) => {
      return {
        success: (dataCallback?: (e: T) => void) => {
          return {
            fail: async (error: string, params?: any) => {
              await api
                .patch(url, data, config)
                .then((e) => {
                  if (dataCallback) {
                    dataCallback(e.data);

                    addToast(caps("success:base.success"), {
                      appearance: "success",
                      autoDismiss: true,
                    });
                  }
                })
                .catch((e: AxiosError<T>) => {
                  addToast("error", {
                    appearance: "error",
                    autoDismiss: true,
                  });

                  //push.error('errors:' + error, params ?? { code: e.response?.status });
                });
            },
          };
        },
      };
    },
    [api, push]
  );

  const apiMemo = useMemo(() => {
    return {
      get: getCallback,
      post: postCallback,
      patch: patchCallback,
    };
  }, [getCallback, postCallback, patchCallback]);

  return apiMemo;
};
