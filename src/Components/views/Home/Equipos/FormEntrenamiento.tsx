import React, { useEffect, useState } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { $u, $x } from "../../../../Common/Utils/Reimports";
import { FileInputWithDescription } from "../../../Forms/FileInputWithDescription";
import { FileUtils } from "../../../../Common/Utils/FileUtils";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { ApiSelect } from "../../../Api/ApiSelect";
import { IDataFormEntrenamiento } from "../../../../Data/Models/Entrenamiento/Entrenamiento";
import { TextArea } from "../../../Forms/TextArea";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { IComponente } from "../../../../Data/Models/Componentes/Componentes";

interface IProps {
  onSubmit: (data: IDataFormEntrenamiento) => void
  isSaving?: boolean
  initialData?: IDataFormEntrenamiento
  isEdit?: boolean
}

const FormEntrenamiento = ({ onSubmit, isSaving, initialData, isEdit = false }: IProps) => {

  //hooks
  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, register } = useForm<IDataFormEntrenamiento>({
    mode: "onSubmit",
    submitFocusError: true
  });

  //states
  const [displayScaler, setDisplayScaler] = useState<string>();
  const [displayModel, setDisplayModel] = useState<string>();
  const [displayPerfilNominal, setDisplayPerfilNominal] = useState<string>();
  const [displayPerfilCritico, setDisplayPerfilCritico] = useState<string>();

  const [componentsForTraining, setComponentsForTraining] = useState<{ id: string, nombre: string }[]>([]);

  //effects
  useEffect(() => {
    { isEdit && register({ name: "id" }, { required: true }) }
  }, [register])

  useEffect(() => {

    // if (!isEdit) {
    //   getServesEquipo(undefined)
    // } else {
    //   if (initialData?.id !== undefined) {
    //     getServesEquipo(initialData.id)
    //   }
    // }

    setValue([
      // { name: initialData?.name },
      // { tipo_equipo: initialData?.tipo_equipo },
      { segments_generate: initialData?.segments_generate },
      { id: initialData?.id },
    ]);

  }, [initialData]);


  const setPerfilNominal = async (file: File) => {
    let fileRead = await FileUtils.fileToWorkbook(file);
    let sheetValues: object[] = $x.utils.sheet_to_json(fileRead.Sheets[fileRead.SheetNames[0]], { header: 1 }) as object[];

    setValue([{ "nominal_file": sheetValues }])
  }

  const setPerfilCritico = async (file: File) => {
    let fileRead = await FileUtils.fileToWorkbook(file);
    let sheetValues: object[] = $x.utils.sheet_to_json(fileRead.Sheets[fileRead.SheetNames[0]], { header: 1 }) as object[];

    setValue([{ "critical_file": sheetValues }])
  }

  const updateComponentes = async (equipoId: string) => {
    await ax.get<{ id: string, nombre: string }[]>('service_render/equipos/componentes_entrenar', { params: { equipo_id: equipoId } })
      .then((response) => {
        setComponentsForTraining(response.data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
      {!isEdit && (
        <Row>
          <Col sm="3" className="mb-3">
            <Controller control={control}
              name="id"
              label="Equipo *"
              rules={{ required: caps('validations:required') }}
              source={'service_render/equipos'}
              queryParams={{ isSelectFilter: true }}
              placeholder={"Seleccione equipo ..."}
              selector={(option: any) => {
                return { label: option.nombre, value: option.id };
              }}
              onChange={(data) => {
                updateComponentes(data[0]);
                return data[0];
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="id">
              {({ message }) => <small className={'text-danger'}>{message}</small>}
            </ErrorMessage>
          </Col>


          <Col sm="3">
            <Controller control={control}
              name="componente"
              label="Componente *"
              rules={{ required: caps('validations:required') }}
              source={componentsForTraining}
              placeholder={"Seleccione componente ..."}
              selector={(option: any) => {
                return { label: option.nombre, value: option.id };
              }}
              onChange={(data) => {
                return data[0];
              }}
              as={ApiSelect}
            />
            <ErrorMessage errors={errors} name="componente">
              {({ message }) => <small className={'text-danger'}>{message}</small>}
            </ErrorMessage>
          </Col>
        </Row>
      )}
      <Row>
        <Col sm={3}>
          <label><b>Modelo (.h5){!isEdit && ' *'}:</b></label>
          <Controller control={control}
            id={"model_file"}
            name={"model_file"}
            onChangeDisplay={(display: string | undefined) => {
              setDisplayModel(state => $u(state, { $set: display }));
            }}
            display={displayModel}
            rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
            as={FileInputWithDescription}
            accept={["h5"]}
          />

          <ErrorMessage errors={errors} name="model_file">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
        </Col>

        <Col sm={3}>
          <label><b>Scaler (.pkl){!isEdit && ' *'}:</b></label>
          <Controller control={control}
            id={"scaler_file"}
            name={"scaler_file"}
            onChangeDisplay={(display: string | undefined) => {
              setDisplayScaler(state => $u(state, { $set: display }));
            }}
            display={displayScaler}
            rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
            as={FileInputWithDescription}
            accept={["pkl"]}
          />

          <ErrorMessage errors={errors} name="scaler_file">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
        </Col>

        <Col sm={3}>
          <label><b>Perfil Nominal:</b></label>
          <Row>

            <Col sm={12}>
              <Controller control={control}
                id={"nominal_file"}
                name={"nominal_file"}
                onChangeDisplay={setDisplayPerfilNominal}
                display={displayPerfilNominal}
                onChange={(data) => {
                  let file: File | null = data[0];
                  if (file) {
                    setPerfilNominal(file);
                  } else {
                    return undefined;
                  }
                }}
                as={FileInputWithDescription}
                accept={["csv"]}
                rules={{
                  validate:
                  {
                    value: value => {
                      let isValueCorrect: boolean = true;
                      if (value && value[0]) {
                        let primeraColumna = ((value[0][0]).toString()).toLowerCase();
                        let segundaColumna = ((value[0][1]).toString()).toLowerCase();
                        isValueCorrect = ((primeraColumna == "coordenada_x") && (segundaColumna == "coordenada_y"))
                      }
                      return isValueCorrect || 'Cabecera de primera columna como (coordenada_x) y segunda columna como (coordenada_y)'
                    }
                  }
                }}

              />
            </Col>
          </Row>

          <ErrorMessage errors={errors} name="nominal_file">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
        </Col>

        <Col sm={3}>
          <label><b>Perfil Crítico:</b></label>
          <Controller control={control}
            id={"critical_file"}
            name={"critical_file"}
            onChange={(data) => {
              let file: File | null = data[0];
              if (file) {
                setPerfilCritico(file);
              } else {
                return undefined;
              }
            }}
            display={displayPerfilCritico}
            onChangeDisplay={setDisplayPerfilCritico}
            as={FileInputWithDescription}
            accept={["csv"]}
            rules={{
              validate:
              {
                value: value => {
                  let isValueCorrect: boolean = true;
                  if (value && value[0]) {
                    let primeraColumna = ((value[0][0]).toString()).toLowerCase();
                    let segundaColumna = ((value[0][1]).toString()).toLowerCase();
                    isValueCorrect = ((primeraColumna == "coordenada_x") && (segundaColumna == "coordenada_y"))
                  }
                  return isValueCorrect || 'Cabecera de primera columna como (coordenada_x) y segunda columna como (coordenada_y)'
                }
              }
            }}
          />
          <ErrorMessage errors={errors} name="critical_file">
            {({ message }) => <small className='text-danger'>{message}</small>}
          </ErrorMessage>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col sm='6'>
          <TextArea
            label="Segmentos a generar *"
            name="segments_generate"
            ref={register({
              required: { value: true, message: caps('validations:required') },
            })}
            placeholder="Segmentos que se desean proyectar"
            errorForm={errors.segments_generate}
          />
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

export default FormEntrenamiento;