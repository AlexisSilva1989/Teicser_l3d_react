import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { IDataFormFabricante } from "../../../../Data/Models/Fabricante/Fabricante";
// import DualListBox, { Option } from 'react-dual-listbox';
// import { AxiosError } from "axios";
// import { useToasts } from "react-toast-notifications";
// import { IDataFormEquipo } from "../../../../Data/Models/Equipo/Equipo";
// import { $u, $x } from "../../../../Common/Utils/Reimports";
// import { FileInputWithDescription } from "../../../Forms/FileInputWithDescription";
// import { FileUtils } from "../../../../Common/Utils/FileUtils";
// import 'react-dual-listbox/lib/react-dual-listbox.css';
// import DualListLang from "../../../../Data/Models/Common/DualListLang";
// import { ax } from "../../../../Common/Utils/AxiosCustom";
// import { ApiSelect } from "../../../Api/ApiSelect";
interface IProps {
  onSubmit: (data: IDataFormFabricante) => void
  isSaving?: boolean
  initialData?: IDataFormFabricante
  isEdit?: boolean
}

const FormFabricante = ({ onSubmit, isSaving, initialData, isEdit = false }: IProps) => {

  //hooks
  const { capitalize: caps } = useFullIntl();
  // const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, register } = useForm<IDataFormFabricante>({
    mode: "onSubmit",
    submitFocusError: true
  });

  //states
  // const [componentSelected, setComponentSelected] = useState<string[] | undefined>([]);
  // const [componentAvailable, setComponentAvailable] = useState<Option<string>[]>([]);

  //effects
  useEffect(() => {
    { isEdit && register({ name: "id" }, { required: true }) }
  }, [register])

  useEffect(() => {

    // if (!isEdit) {
    //   getComponentesFabricante(undefined)
    // } else {
    //   if (initialData?.id !== undefined) {
    //     getComponentesFabricante(initialData.id)
    //   }
    // }

    setValue([
      { name: initialData?.name },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);

    console.log('initialData: ', initialData);
  }, [initialData]);

  /*OBTENER COMPONENTES REGISTRADOS Y SELECCIONADOS */
  // const getComponentesFabricante = async (fabricanteId: string | undefined) => {
  //   await ax.get<{ componentsSelected: string[], componentsAvailable: Option<string>[] }>('fabricantes/componentes', { params: { id_fabricante: fabricanteId } })
  //     .then((response) => {
  //       setComponentSelected(response.data.componentsSelected);
  //       setComponentAvailable(response.data.componentsAvailable);
  //       setValue([
  //         { components_selected: response.data.componentsSelected }
  //       ]);
  //     })
  //     .catch((e: AxiosError) => {
  //       if (e.response) {
  //         addToast(caps('errors:base.load', { element: "componentes" }), {
  //           appearance: 'error',
  //           autoDismiss: true,
  //         });
  //       }
  //     });
  // }

  return (<>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm={12} className={"mb-2"}>
          <Textbox
            label={`Nombre *`}
            name={"name"}
            id={"name"}
            placeholder={"Nombre del fabricante"}
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

        {
          isEdit && <Col sm={12}>
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

      {/* <Row>
        <Col sm={12}>
          <label><b>Componentes:</b></label>
          <Controller control={control}
            as={DualListBox}
            id={"components_selected"}
            name={"components_selected"}
            className={"react-dual-listbox-medium"}
            options={componentAvailable}
            selected={componentSelected}
            canFilter
            alignActions={'top'}
            filterPlaceholder={'Buscar componente...'}
            showHeaderLabels={true}
            preserveSelectOrder
            showOrderButtons={true}
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
          { {
            isEdit && (
              <Col className="alert alert-warning mt-3">
                <i className="fa fa-exclamation-triangle mr-2" aria-hidden="true" />
                Remover un componente seleccionado para el fabricante, elimina los datos de entrenamiento existente para el mismo
                <strong> ¡Esta acción es irreversible!</strong> .
              </Col>
            )} 

        </Col>
      </Row> */}
      <Row>
        <Col sm={12} className={"text-right mt-3"}>
          <Button variant={"primary"} type="submit" disabled={isSaving}>
            {isSaving
              ? (<i className="fas fa-circle-notch fa-spin mr-3"></i>)
              : isEdit
                ? (<i className="fas fa-save mr-3" />)
                : (<i className="fas fa-plus mr-3" />)
            }
            {
              isEdit ? "Guardar" : "Agregar"
            }
          </Button>
        </Col>
      </Row>

    </form>
  </>);
}

export default FormFabricante