import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { useCommonRoutes } from "../../Common/Hooks/useCommonRoutes";
import React, {
  useState,
  useEffect,
  ReactNode,
  useMemo,
  Fragment,
} from "react";
import { $u, $j } from "../../Common/Utils/Reimports";
import { Redirect } from "react-router-dom";
import { FormBase } from "./FormBase";
import {
  ValidatedInput,
  EMBEDDED,
  SELECT_MODAL,
  RADIOBOX,
  FILE_INPUT_PREVIEW,
} from "../../Components/Forms/ValidatedForm";
// import { ConfirmationModal } from '../../Components/Common/ConfirmationModal';
// import { usePushError } from "../../Common/Hooks/usePushError";
import { useFullLocation } from "../../Common/Hooks/useFullLocation";
import {
  usePermissions,
  UserPermission,
} from "../../Common/Hooks/usePermissions";
import { ax } from "../../Common/Utils/AxiosCustom";
import { useShortModal } from "../../Common/Hooks/useModal";
import { Modal, Button } from "react-bootstrap";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { AxiosError } from "axios";

import { useToasts } from "react-toast-notifications";

export const EMBEDDED_VALUE = "EMBEDDED_VALUE";

interface Props<TCast, TRaw, TData> {
  path: string;
  title: string;
  validations: any;
  permission: UserPermission;
  errorElement: string;
  warningElement?: any;
  reset?: boolean;
  fields: ((
    | ValidatedInput
    | {
        type: typeof EMBEDDED_VALUE;
        name?: string;
        element: (e: TCast) => ReactNode;
      }
  ) & { select?: (e: TCast) => any })[];

  nameLabel?: string;

  getId: (e: TCast) => string;

  onReset?: () => void;
  onSerialize?: (e: TRaw) => TData;
  onDataLoad?: (e: TCast) => void;
  customValidate?: (e: TData) => boolean;
}

interface State<T> {
  data: {
    element?: T;
  };
  loading: boolean;
}

export const ModificarBase = <
  TCast extends unknown,
  TRaw extends unknown,
  TData extends unknown
>(
  props: Props<TCast, TRaw, TData>
) => {
  const { capitalize: caps, localize } = useFullIntl();
  const { goBack } = useCommonRoutes();
  const { addToast } = useToasts();
  // const { pushError } = usePushError();
  const { getState } = useFullLocation();
  const { canDelete } = usePermissions();
  const { label, title, message } = useLocalization();
  const initial: State<TCast> = {
    data: {},
    loading: true,
  };
  const [init, setInit] = useState<boolean>(false);

  const [data, setData] = useState(initial.data);
  const [loading, setLoading] = useState(initial.loading);

  const fields = useMemo(() => {
    const elements = props.fields.map((x) => {
      if (x.type === "EMBEDDED_VALUE") {
        return {
          type: EMBEDDED,
          name: x.name,
          element: data.element == null ? undefined : x.element(data.element),
        };
      } else if (x.type === SELECT_MODAL) {
        return {
          ...x,
          initialValue:
            x.select == null || data.element == null
              ? undefined
              : x.select(data.element),
        };
      } else if (x.type === RADIOBOX) {
        return {
          ...x,
          value:
            x.select == null || data.element == null
              ? undefined
              : x.select(data.element),
        };
      } else if (x.type === FILE_INPUT_PREVIEW) {
        return {
          ...x,
          src:
            x.select == null || data.element == null
              ? undefined
              : x.select(data.element),
        };
      }
      return {
        ...x,
        value:
          x.select == null || data.element == null
            ? undefined
            : x.select(data.element),
      };
    });
    return elements;
  }, [props.fields, canDelete, caps, data.element, props.permission]);

  const { data: element } = getState<{ data: TCast }>();
  const { getId, onDataLoad: onChangeData } = props;
  const modalEliminar = useShortModal();

  useEffect(() => {
    if (!init) {
      fetch();
    }
    async function fetch() {
      if (element == null) {
        return;
      }

      setLoading(() => true);

      await ax
        .get<TCast>($j(props.path, getId(element)))
        .then((e) => {
          setData((s) => $u(s, { element: { $set: e.data } }));
          if (onChangeData != null) {
            onChangeData(e.data);
          }
          setInit(true);
          setLoading(() => false);
        })
        .catch((e: AxiosError) => {
          const messageError =
            e.response && e.response.data.hasOwnProperty("errors")
              ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
              : caps("errors:base.load", {
                  element: localize(props.errorElement),
                });
          addToast(messageError, {
            appearance: "error",
            autoDismiss: true,
          });
          //pushError(caps('errors:base.load', { element: localize(props.errorElement) }));
        });
    }
  }, [
    element,
    props.path,
    props.errorElement,
    getId,
    caps,
    onChangeData,
    localize,
  ]);

  async function onSubmit(data: any) {
    if (element == null) {
      throw new Error("Element shouln't be null");
    }

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
      .patch(
        $j(props.path, props.getId(element)),
        tieneImagen ? formData : data,
        headers
      )
      .then((response) => {
        if (response.status === 202) {
          addToast(
            caps("errors:base.update", {
              element: localize(props.warningElement),
            }),
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
          //pushError(caps('errors:base.update', { element: localize(props.warningElement) }));
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
            : caps("errors:base.update", {
                element: localize(props.errorElement),
              });
          addToast(messageError, {
            appearance: "error",
            autoDismiss: true,
          });
          //pushError(caps('errors:base.update', { element: localize(props.errorElement) }));
        }
      });
  }

  async function onConfirmEliminar() {
    if (element == null) {
      throw new Error("Element shouln't be null");
    }

    await ax
      .delete($j(props.path, props.getId(element)))
      .then(() => {
        goBack();

        addToast(caps("success:base.success"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        const messageError =
          e.response && e.response.data.hasOwnProperty("errors")
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : caps("errors:base.delete", {
                element: localize(props.errorElement),
              });
        addToast(messageError, {
          appearance: "error",
          autoDismiss: true,
        });
        //pushError(caps('errors:base.delete', { element: localize(props.errorElement) }));
      });
    modalEliminar.hide();
  }

  if (element == null) {
    return <Redirect to={caps("routes:meta.not_found")} />;
  }
  return (
    <Fragment>
      <FormBase<TRaw, TData>
        title={props.title}
        onSubmit={onSubmit}
        loading={loading}
        onSerialize={props.onSerialize}
        onReset={props.onReset}
        reset={props.reset}
        validations={props.validations}
        fields={fields as any}
        submitLabel="labels:links.edit"
      />
      <Modal show={modalEliminar.visible} onHide={modalEliminar.hide}>
        <Modal.Header closeButton>
          <b>{title("confirm_remove_of_client")}</b>
        </Modal.Header>
        <Modal.Body>
          {message("confirmations.on_remove_permanent_element")}
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button
            variant="outline-secondary"
            className="mr-3"
            onClick={modalEliminar.hide}
          >
            {label("cancel")}
          </Button>
          <Button variant="danger" onClick={onConfirmEliminar}>
            {label("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
