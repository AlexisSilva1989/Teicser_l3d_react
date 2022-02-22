import React, { useEffect, useState } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import Select from "react-select";
import { IDataFormEquipo, tiposEquipos } from "../../../../Data/Models/Equipo/Equipo";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { $u, $x } from "../../../../Common/Utils/Reimports";
import { FileInputWithDescription } from "../../../Forms/FileInputWithDescription";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { useShortModal } from "../../../../Common/Hooks/useModal";
import { FileUtils } from "../../../../Common/Utils/FileUtils";
import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox, { Option } from 'react-dual-listbox';
import DualListLang from "../../../../Data/Models/Common/DualListLang";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { useToasts } from "react-toast-notifications";
interface IProps {
  onSubmit: (data: IDataFormEquipo) => void
  isSaving?: boolean
  initialData?: IDataFormEquipo
  isEdit?: boolean
}

const FormEquipo = ({ onSubmit, isSaving, initialData, isEdit = false }: IProps) => {

  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const { handleSubmit, control, errors, setValue, register, setError, clearError } = useForm<IDataFormEquipo>({
    mode: "onSubmit",
    submitFocusError: true
  });

  const [displayScaler, setDisplayScaler] = useState<string>();
  const [displayModel, setDisplayModel] = useState<string>();
  const [displayPerfilNominal, setDisplayPerfilNominal] = useState<string>();
  const [displayPerfilCritico, setDisplayPerfilCritico] = useState<string>();
  const [displayCheckpoint, setDisplayCheckpoint] = useState<string>();
  
  const [serverSelected, setServerSelected] = useState<string[] | undefined >([]);
  const [serverAvailable, setServerAvailable] = useState<Option<string>[]>([]);


  useEffect(() => {
    { isEdit && register({ name: "id" }, { required: true }) }
  }, [register])

  useEffect(() => {

    if(!isEdit){
      getServesEquipo(undefined);
    }else{
      if(initialData?.id !== undefined){
        getServesEquipo(initialData.id);
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
    await ax.get<{serversSelected: string[], serversAvailable: Option<string>[] }>('service_render/equipos/servidores',{ params: {equipoId : equipoId }})
      .then((response) => {
        setServerSelected(response.data.serversSelected );
        setServerAvailable(response.data.serversAvailable);
        setValue([
          { server_selected: response.data.serversSelected}
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

  const setPerfilNominal = async (file : File) => {
    let fileRead = await FileUtils.fileToWorkbook(file);
    let sheetValues : object[] = $x.utils.sheet_to_json(fileRead.Sheets[fileRead.SheetNames[0]], { header: 1 }) as object[];
              
    setValue([{"perfil_nominal":sheetValues}])
  }

  const setPerfilCritico = async (file : File) => {
    let fileRead = await FileUtils.fileToWorkbook(file);
    let sheetValues: object[]  = $x.utils.sheet_to_json(fileRead.Sheets[fileRead.SheetNames[0]], { header: 1 }) as object[];
              
    setValue([{"perfil_critico":sheetValues}])
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
            <Controller
              name="tipo_equipo"
              control={control}
              rules={{ required: caps('validations:required') }}
              id={"tipo_equipo"}
              options={tiposEquipos}

              styles={{
                control: (base: any) => ({
                  ...base,
                  minHeight: 'calc(1.5em + 1.25rem + 1.75px)',
                  borderColor: '#e3eaef',
                  borderRadius: '0.25rem'
                }),
                indicatorsContainer: (base: any) => ({
                  ...base,
                  div: { padding: 5 }
                })
              }}
              as={Select}
            />
            <ErrorMessage errors={errors} name="tipo_equipo">
              {({ message }) => <small className={'text-danger'}>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={3}>
            <label><b>Modelo (.h5){!isEdit && ' *'}:</b></label>
            <Controller control={control}
              id={"file_model"}
              name={"file_model"}
              onChangeDisplay={(display: string | undefined) => {
                setDisplayModel(state => $u(state, { $set: display }));
              }}
              display={displayModel}
              rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
              as={FileInputWithDescription}
              accept={["h5"]}
            />

            <ErrorMessage errors={errors} name="file_model">
              {({ message }) => <small className='text-danger'>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={3}>
            <label><b>Scaler (.pkl){!isEdit && ' *'}:</b></label>
            <Controller control={control}
              id={"file_scaler"}
              name={"file_scaler"}
              onChangeDisplay={(display: string | undefined) => {
                setDisplayScaler(state => $u(state, { $set: display }));
              }}
              display={displayScaler}
              rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
              as={FileInputWithDescription}
              accept={["pkl"]}
            />

            <ErrorMessage errors={errors} name="file_scaler">
              {({ message }) => <small className='text-danger'>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={3}>
            <label><b>Checkpoint{!isEdit && ' *'}:</b></label>
            <Controller control={control}
              id={"file_checkpoint"}
              name={"file_checkpoint"}
              onChangeDisplay={(display: string | undefined) => {
                setDisplayCheckpoint(state => $u(state, { $set: display }));
              }}
              display={displayCheckpoint}
              rules={{ required: { value: !isEdit, message: caps('validations:required') } }}
              as={FileInputWithDescription}
            />

            <ErrorMessage errors={errors} name="file_checkpoint">
              {({ message }) => <small className='text-danger'>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={3}>
            <label><b>Perfil Nominal:</b></label>
            <Row>

              <Col sm={12}>
                <Controller control={control}
                  id={"perfil_nominal"} 
                  name={"perfil_nominal"}
                  onChangeDisplay={setDisplayPerfilNominal}
                  display={displayPerfilNominal}
                  onChange={ (data )=> {
                    let file : File | null =  data[0];
                    if (file) {
                      setPerfilNominal(file);
                    }else{
                    return undefined;
                    }
                  }}
                  as={FileInputWithDescription}
                  accept={["csv"]}
                  rules={{ validate: 
                    { 
                      value: value => {
                        let isValueCorrect : boolean = true;
                        if (value && value[0]){
                          let primeraColumna = ((value[0][0]).toString()).toLowerCase();
                          let segundaColumna = ((value[0][1]).toString()).toLowerCase();
                          isValueCorrect =  (( primeraColumna == "coordenada_x") && ( segundaColumna == "coordenada_y") )
                        }
                        return isValueCorrect || 'Cabecera de primera columna como (coordenada_x) y segunda columna como (coordenada_y)'
                      }
                    } 
                  }}

                />
              </Col>
            </Row>

            <ErrorMessage errors={errors} name="perfil_nominal">
              {({ message }) => <small className='text-danger'>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={3}>
            <label><b>Perfil Crítico:</b></label>
            <Controller control={control}
              id={"perfil_critico"}
              name={"perfil_critico"}
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
            <ErrorMessage errors={errors} name="perfil_critico">
              {({ message }) => <small className='text-danger'>{message}</small>}
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
          <label><b>Servidores{!isEdit && ' *'}:</b></label>
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
            onChange={ (data )=> {
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