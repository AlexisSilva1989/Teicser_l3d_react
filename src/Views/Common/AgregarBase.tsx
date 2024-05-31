import { useCommonRoutes } from "../../Common/Hooks/useCommonRoutes";
import { FormBase } from "./FormBase";
import React from "react";
import { ValidatedInput } from "../../Components/Forms/ValidatedForm";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
// import { usePushError } from '../../Common/Hooks/usePushError';
import { ax } from "../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { useToasts } from "react-toast-notifications";
import { FILE_INPUT_PREVIEW } from "../../Components/Forms/ValidatedForm";

interface Props<TRaw, TData> {
  unique?: string;
  path: string;
  title: string;
  validations: any;
  errorElement: string;
  warningElement?: any;
  fields: ValidatedInput[];

  reset?: boolean;
  loading?: boolean;
  onReset?: () => void;
  onSerialize?: (e: TRaw) => TData;
  customValidate?: (e: TData) => boolean;
}

export const AgregarBase = <TRaw extends unknown, TData extends unknown>(
  props: Props<TRaw, TData>
) => {
  const { goBack } = useCommonRoutes();
  // const { pushError } = usePushError();
  const { capitalize: caps, localize } = useFullIntl();
  const { addToast } = useToasts();

  async function onSubmit(data: any) {
    if (props.customValidate != null) {
      if (!props.customValidate(data)) {
        return;
      }
    }
    const formData = new FormData();
    const tieneImagen = props.fields.some(
      (field) => field.type === FILE_INPUT_PREVIEW
    );
    const headers = tieneImagen
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : { "Content-Type": "application/json" };

    if (tieneImagen) {
      for (const property in data) {
        formData.append(property, data[property]);
      }
    }

    await ax
      .post(props.path, tieneImagen ? formData : data, headers)
      .then((response) => {
        if (response.status === 202) {
          addToast(
            caps("errors:base.post", {
              element: localize(props.warningElement),
            }),
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
          //pushError(caps('errors:base.post', { element: localize(props.warningElement) }), { code: response.status });
        } else {
          goBack();
          addToast(caps("success:base.success"), {
            appearance: "success",
            autoDismiss: true,
          });
        }
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const messageError = e.response.data.hasOwnProperty("errors")
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : caps("errors:base.post", {
                element: localize(props.errorElement),
              });
          addToast(messageError, {
            appearance: "error",
            autoDismiss: true,
          });
          //pushError(caps('errors:base.post', { element: localize(props.errorElement) }), { code: e.response.status });
        }
      });
  }

  return (
    <FormBase<TRaw, TData>
      unique={props.unique}
      submitLabel="labels:links.save"
      title={props.title}
      path={props.path}
      onSubmit={onSubmit}
      fields={props.fields}
      loading={props.loading}
      onReset={props.onReset}
      onSerialize={props.onSerialize}
      reset={props.reset}
      validations={props.validations}
    />
  );
};
