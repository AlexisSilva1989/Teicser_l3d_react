import React, { useEffect, useState } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { $u } from "../../../../Common/Utils/Reimports";
import { FileInputWithDescription } from "../../../Forms/FileInputWithDescription";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { ApiSelect } from "../../../Api/ApiSelect";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { IDataFormPlanos } from "../../../../Data/Models/Binnacle/planos";
import { LoadingSpinner } from "../../../Common/LoadingSpinner";

interface IProps {
  initialData?: IDataFormPlanos
  onFinishSaving?: () => void
}

const FormPlano = ({ initialData, onFinishSaving }: IProps) => {
  //hooks
  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, watch } = useForm<IDataFormPlanos>({
    mode: "onSubmit",
    submitFocusError: true
  });

  //states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingEquipo, setIsLoadingEquipo] = useState<boolean>(false);
  const [isLoadingFabricante, setIsLoadingFabricante] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>();

  //EFFECTS
  useEffect(() => {

    setValue([
      { equipo: initialData?.equipo },
      { tipo_plano: initialData?.tipo_plano },
    ]);

  }, [initialData]);

  useEffect(() => {
    setIsLoadingEquipo(true)
    setIsLoadingFabricante(true)
  }, [])

  //HANDLES
  const onSubmit = async (data: IDataFormPlanos) => {

    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    formData.append("idEquipo", data?.equipo as string);
    formData.append("file", data?.plano);

    let pathPlano = 'planos_conjunto'
    if (data.tipo_plano === "planos_componentes") {
      formData.append("idFabricante", data.fabricante as string);
      pathPlano = 'planos_componentes'
    }


    setIsSaving(true);
    await ax.post(pathPlano, formData, headers)
      .then((response) => {
        setDisplay(undefined)
        addToast('Plano cargado correctamente', {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const msgError = e.response.data.errors
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : caps('errors:base.post', { element: "planos de componentes" })
          addToast(msgError,
            { appearance: 'error', autoDismiss: true }
          );
        }
      })
      .finally(() => {
        setIsSaving(false);
        onFinishSaving && onFinishSaving()
      });
  }
  const watchFields = watch(["tipo_plano"]);


  return (<>

    <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      <Row>
        <Col className="mb-3">
          <Controller control={control}
            name="equipo"
            label="Equipo *"
            rules={{ required: caps('validations:required') }}
            source={'service_render/equipos'}
            queryParams={{ isSelectFilter: true }}
            placeholder={"Seleccione equipo ..."}
            selector={(option: any) => {
              return { label: option.nombre, value: option.id };
            }}
            as={ApiSelect}
            defaultValue={initialData?.equipo ?? undefined}
            onFinishLoad={
              () => {
                setIsLoadingEquipo(false)
              }
            }
          />
          <ErrorMessage errors={errors} name="equipo">
            {({ message }) => <small className={'text-danger'}>{message}</small>}
          </ErrorMessage>
        </Col>
      </Row>

      <Row>
        <Col className="mb-3">
          <Controller control={control}
            name="tipo_plano"
            label="Tipo de plano *"
            rules={{ required: caps('validations:required') }}
            source={[
              {
                label: "Conjunto",
                value: 'planos_conjunto'
              },
              {
                label: "Componente",
                value: 'planos_componentes'
              }
            ]}
            placeholder={"Seleccione tipo de plano ..."}
            selector={(option: any) => {
              return { label: option.label, value: option.value };
            }}
            as={ApiSelect}
          />
          <ErrorMessage errors={errors} name="tipo_plano">
            {({ message }) => <small className={'text-danger'}>{message}</small>}
          </ErrorMessage>
        </Col>
      </Row>

      <Row hidden={watchFields['tipo_plano'] === 'planos_conjunto'}>
        <Col className="mb-3">
          <Controller control={control}
            name="fabricante"
            label="Fabricante *"
            rules={{ required: caps('validations:required') }}
            source={'fabricantes/select'}
            placeholder={"Seleccione fabricante ..."}
            selector={(option: any) => {
              return { label: option.name, value: option.id };
            }}
            onFinishLoad={
              () => {
                setIsLoadingFabricante(false)
              }
            }
            as={ApiSelect}
          />
          <ErrorMessage errors={errors} name="fabricante">
            {({ message }) => <small className={'text-danger'}>{message}</small>}
          </ErrorMessage>
        </Col>
      </Row>

      <Row>
        <Col className="mb-3">
          <Controller control={control}
            id={"plano"}
            name={"plano"}
            label="Plano"
            onChangeDisplay={(display: string | undefined) => {
              setDisplay(state => $u(state, { $set: display }));
            }}
            display={display}
            accept={["pdf"]}
            rules={{ required: { value: true, message: 'Por favor, seleccione un archivo' } }}
            as={FileInputWithDescription}
          />

          <ErrorMessage errors={errors} name="plano">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
        </Col>
      </Row>

      <Row>
        <Col sm={12} className={"text-right mt-3"}>
          <Button variant={"primary"} type="submit" disabled={isSaving || isLoadingEquipo || isLoadingFabricante}>
            {isSaving
              ? (<i className="fas fa-circle-notch fa-spin"></i>)
              : (<> <i className="fas fa-save mr-3" /> {'Guardar'} </>)

            }
          </Button>
        </Col>
      </Row>
    </form>


  </>);
};

export default FormPlano;