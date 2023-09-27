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
} from "../../Components/Forms/ValidatedForm";
// import { usePushError } from '../../Common/Hooks/usePushError';
import { useFullLocation } from "../../Common/Hooks/useFullLocation";
import {
  usePermissions,
  UserPermission,
} from "../../Common/Hooks/usePermissions";
import { ax } from "../../Common/Utils/AxiosCustom";
import { useShortModal } from "../../Common/Hooks/useModal";
import { Modal, Button, Col, Row } from "react-bootstrap";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { Datepicker } from "../../Components/Forms/Datepicker";
import { Usuario } from "../../Data/Models/Configuracion/Usuario";
import { AxiosError } from "axios";

import { useToasts } from "react-toast-notifications";

export const EMBEDDED_VALUE = "EMBEDDED_VALUE";

interface Props<TCast, TRaw, TData> {
  path: string;
  title: string;
  validations: any;
  permission: UserPermission;
  errorElement: string;
  fields: ((
    | ValidatedInput
    | {
        type: typeof EMBEDDED_VALUE;
        name?: string;
        element: (e: TCast) => ReactNode;
      }
  ) & { select?: (e: TCast) => any })[];

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

export const ModificarBaseUsuario = <
  TCast extends unknown,
  TRaw extends unknown,
  TData extends unknown
>(
  props: Props<TCast, TRaw, TData>
) => {
  const { capitalize: caps, localize } = useFullIntl();
  const { goBack } = useCommonRoutes();
  // const { pushError } = usePushError();
  const { getState } = useFullLocation();
  const { canDelete } = usePermissions();
  const { label, title } = useLocalization();

  const { addToast } = useToasts();

  const initial: State<TCast> = {
    data: {},
    loading: true,
  };
  const [data, setData] = useState(initial.data);
  const [loading, setLoading] = useState(initial.loading);
  const { data: element } = getState<{ data: TCast }>();
  const { getId, onDataLoad: onChangeData } = props;

  const modalInactividad = useShortModal();

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
      }
      return {
        ...x,
        value:
          x.select == null || data.element == null
            ? undefined
            : x.select(data.element),
      };
    });
    // const foo = '';

    // push radio buttons into array of fields
    // elements.push({
    // 	type: EMBEDDED,
    // 	element: canDelete(props.permission) && (
    // 		<div className='col-6 mt-5 pt-2'>
    // 			<strong>
    // 				<b>{label('select_deactivate_user')}:</b>
    // 			</strong>

    // 			<b className='ml-3 mr-2'>{label('no')}</b>
    // 			<input
    // 				name='active'
    // 				type='radio'
    // 				value='false'
    // 				checked={(element as Usuario).activo === true}
    // 				onClick={() => {
    // 					const newElement: Usuario = element as Usuario;
    // 					newElement.activo = true;
    // 					setData({ element: newElement as TCast });
    // 				}}
    // 			/>

    // 			<b className='ml-3 mr-2'> {label('yes')}</b>
    // 			<input
    // 				name='active'
    // 				type='radio'
    // 				value='true'
    // 				checked={(element as Usuario).activo === false}
    // 				onClick={() => {
    // 					modalInactividad.show();
    // 				}}
    // 			/>
    // 		</div>
    // 	),
    // 	value: '',
    // });
    return elements;
  }, [props.fields, canDelete, caps, data.element, props.permission]);

  // Fetch data for the given form value. Run on dependency modification
  useEffect(() => {
    fetch();
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

  // function for submitting data
  async function onSubmit(data: TData) {
    if (element == null) {
      throw new Error("Element shouln't be null");
    }

    if (props.customValidate != null) {
      if (!props.customValidate(data)) {
        return;
      }
    }
    await ax
      .patch($j(props.path, props.getId(element)), data)
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
            : caps("errors:base.update", {
                element: localize(props.errorElement),
              });
        addToast(messageError, {
          appearance: "error",
          autoDismiss: true,
        });
        //pushError(caps('errors:base.update', { element: localize(props.errorElement) }));
      });
  }

  // element contains data for the given row
  if (element == null) {
    return <Redirect to={caps("routes:meta.not_found")} />;
  }

  const saveDate = (fecha: string) => {};

  async function onUserDeactivateConfirm() {
    // TODO: should validate saveDate value to not be null
    if (element == null) {
      throw new Error("Element shouln't be null");
    }

    const newElement: Usuario = element as Usuario;
    newElement.activo = false;
    setData({ element: newElement as TCast });

    modalInactividad.hide();
  }

  return (
    <Fragment>
      <FormBase<TRaw, TData>
        title={props.title}
        onSubmit={onSubmit}
        loading={loading}
        onSerialize={props.onSerialize}
        onReset={props.onReset}
        validations={props.validations}
        fields={fields as any}
      />
      <Modal show={modalInactividad.visible} onHide={modalInactividad.hide}>
        <Modal.Header closeButton>
          <b>{title("enter_inactivity_date")}</b>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              <Datepicker label="fecha de inactividad" onChange={saveDate} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button
            variant="outline-secondary"
            className="mr-3"
            onClick={modalInactividad.hide}
          >
            {label("cancel")}
          </Button>
          <Button variant="danger" onClick={onUserDeactivateConfirm}>
            {title("confirm_changes")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
