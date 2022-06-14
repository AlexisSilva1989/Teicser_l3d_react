import React, { useEffect, useState } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import DualListBox, { Option } from 'react-dual-listbox';
import { AxiosError } from "axios";
import { useToasts } from "react-toast-notifications";
import { Textbox } from "../../../Forms/Textbox";
import { IDataFormEquipo } from "../../../../Data/Models/Equipo/Equipo";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { $u, $x } from "../../../../Common/Utils/Reimports";
import { FileInputWithDescription } from "../../../Forms/FileInputWithDescription";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { FileUtils } from "../../../../Common/Utils/FileUtils";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListLang from "../../../../Data/Models/Common/DualListLang";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { ApiSelect } from "../../../Api/ApiSelect";
interface IProps {
  onSubmit: (data: IDataFormEquipo) => void
  isSaving?: boolean
  initialData?: IDataFormEquipo
  isEdit?: boolean
}

const FormEquipo = ({ onSubmit, isSaving, initialData, isEdit = false }: IProps) => {

  //hooks
  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, register, setError, clearError } = useForm<IDataFormEquipo>({
    mode: "onSubmit",
    submitFocusError: true
  });

  //states
  const [serverSelected, setServerSelected] = useState<string[] | undefined>([]);
  const [serverAvailable, setServerAvailable] = useState<Option<string>[]>([]);

  const [componentSelected, setComponentSelected] = useState<string[] | undefined>([]);
  const [componentAvailable, setComponentAvailable] = useState<Option<string>[]>([]);

  //effects
  useEffect(() => {
    { isEdit && register({ name: "id" }, { required: true }) }
  }, [register])

  useEffect(() => {

    if (!isEdit) {
      getComponentsEquipo(undefined)
      getServesEquipo(undefined)
    } else {
      if (initialData?.id !== undefined) {
        getComponentsEquipo(initialData.id)
        getServesEquipo(initialData.id)
      }
    }

    setValue([
      { name: initialData?.name },
      { tipo_equipo: initialData?.tipo_equipo },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);

  }, [initialData]);


  /*OBTENER SERVIDORES REGISTRADOS Y SELECCIONADOS */
  const getServesEquipo = async (equipoId: string | undefined) => {
    await ax.get<{ serversSelected: string[], serversAvailable: Option<string>[] }>('service_render/equipos/servidores', { params: { equipoId: equipoId } })
      .then((response) => {
        setServerSelected(response.data.serversSelected);
        setServerAvailable(response.data.serversAvailable);
        setValue([
          { server_selected: response.data.serversSelected }
        ]);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.load', { element: "servidores" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  }

  /*OBTENER COMPONENTES REGISTRADOS Y SELECCIONADOS */
  const getComponentsEquipo = async (equipoId: string | undefined) => {
    await ax.get<{ componentsSelected: string[], componentsAvailable: Option<string>[] }>('service_render/equipos/componentes', { params: { equipoId: equipoId } })
      .then((response) => {
        setComponentSelected(response.data.componentsSelected);
        setComponentAvailable(response.data.componentsAvailable);
        setValue([
          { components_selected: response.data.componentsSelected }
        ]);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.load', { element: "componentes" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      });
  }

  return (<>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={3} className={"mb-2"}>
          <Textbox
            label={`Nombre *`}
            name={"name"}
            id={"name"}
            placeholder={"Nombre del equipo"}
            ref={register({
              required: { value: true, message: caps('validations:required') },
              maxLength: {
                value: 50,
                message: "Máximo 50 caracteres permitidos",
              },
            })}
            errorForm={errors.name}
          />
        </Col>

        <Col sm={3} className={"mb-2"}>
          <label><b>Tipo *:</b></label>
          <Controller control={control}
            name="tipo_equipo"
            rules={{ required: caps('validations:required') }}
            source={'service_render/equipos/tipos'}
            defaultValue={'-1'}
            selector={(option: any) => {
              return { label: option.nombre_corto, value: option.id };
            }}

            onChange={(data) => {
              return data[0];
            }}
            as={ApiSelect}
          />
          <ErrorMessage errors={errors} name="tipo_equipo">
            {({ message }) => <small className={'text-danger'}>{message}</small>}
          </ErrorMessage>
        </Col>
        {
          isEdit && <Col sm={3}>
            <label><b>Activo *:</b></label>
            <Controller control={control}
              name={"status"}
              options={[
                {
                  label: "Si",
                  value: "1"
                }, {
                  label: "No",
                  value: "0"
                }
              ]}

              rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
              as={RadioSelect}
            />

            <ErrorMessage errors={errors} name="status">
              {({ message }) => <small className='text-danger'>{message}</small>}
            </ErrorMessage>
          </Col>
        }
      </Row>

      <Row>
        <Col sm={12}>
          <label><b>Componentes:</b></label>
          <Controller control={control}
            as={DualListBox}
            id={"components_selected"}
            name={"components_selected"}
            options={componentAvailable}
            selected={componentSelected}
            canFilter
            filterPlaceholder={'Buscar componente...'}
            showHeaderLabels={true}
            lang={DualListLang}
            onChange={(data) => {
              setComponentSelected(data[0]);
              return data[0];
            }}
            rules={{
              validate:
              {
                value: (value: string[]) => {
                  return (value != undefined && value.length > 0) || 'Seleccione almenos un (1) componente'
                }
              }
            }}
          />
          <ErrorMessage errors={errors} name="components_selected">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
          {
            isEdit && (
              <Col className="alert alert-warning mt-3">
                <i className="fa fa-exclamation-triangle mr-2" aria-hidden="true" />
                Remover un componente seleccionado para el equipo, elimina los datos de entrenamiento existente para el mismo
                <strong> ¡Esta acción es irreversible!</strong> .
              </Col>
            )}

        </Col>
      </Row>

      <Row className="mt-4">
        <Col sm={12}>
          <label><b>Servidores *:</b></label>
          <Controller control={control}
            as={DualListBox}
            id={"server_selected"}
            name={"server_selected"}
            options={serverAvailable}
            selected={serverSelected}
            canFilter
            filterPlaceholder={'Buscar servidor...'}
            showHeaderLabels={true}
            lang={DualListLang}
            onChange={(data) => {
              setServerSelected(data[0]);
              return data[0];
            }}
            rules={{
              validate:
              {
                value: (value: string[]) => {
                  return (value != undefined && value.length > 0) || 'Seleccione almenos un (1) servidor'
                }
              }
            }}
          />
          <ErrorMessage errors={errors} name="server_selected">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
          <Col className="alert alert-info mt-3">
            <i className="fa fa-info mr-2" aria-hidden="true" />
            Seleccione los servidores donde seran ejecutadas las proyecciones
          </Col>
        </Col>
      </Row>

      <Row>
        <Col sm={12} className={"text-right mt-3"}>
          <Button variant={"primary"} type="submit" disabled={isSaving}>
            {isSaving
              ? (<i className="fas fa-circle-notch fa-spin"></i>)
              : isEdit
                ? (<> <i className="fas fa-save mr-3" /> {'Guardar'} </>)
                : (<> <i className="fas fa-plus mr-3" /> {'Agregar'} </>)
            }
          </Button>
        </Col>
      </Row>

    </form>
  </>);
};

export default FormEquipo;