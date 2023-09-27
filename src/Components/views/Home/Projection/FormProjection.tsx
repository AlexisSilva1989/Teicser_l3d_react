import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Controller, ErrorMessage, useForm } from 'react-hook-form';
import Select from 'react-select';
import { AxiosError } from 'axios';
import { useToasts } from 'react-toast-notifications';
import { Datepicker } from '../../../Forms/Datepicker';
import { Textbox } from '../../../Forms/Textbox';
import { RadioSelect } from '.././../../../Components/Forms/RadioSelect';
import { useLocalization } from '../../../../Common/Hooks/useLocalization';
import { $m } from '../../../../Common/Utils/Reimports';
import { ApiSelect } from '../../../Api/ApiSelect';
import { IComponente } from '../../../../Data/Models/Componentes/Componentes';
import { ax } from '../../../../Common/Utils/AxiosCustom';
import { useFullIntl } from '../../../../Common/Hooks/useFullIntl';
import { LoadingSpinner } from '../../../Common/LoadingSpinner';
import { Utils } from '../../../../Common/Utils/Utils';
import { ONLY_NUMBER } from '../../../../Enums';
import { ShowMessageInModule } from '../../../Common/ShowMessageInModule';

interface IProps {
  onSubmit: (data: IdataFormProjection) => void
  lastDateProjection: string | undefined
  isSaving?: boolean
  textButtonSubmit?: string
  dateFillEnd: string | undefined
  typeProjection: string
  onChangeDate?: (dateFill: string) => void
  onChangeTypeProjection?: (typeProjection: string) => void
  onChangeEquipo?: (equipoId: string) => void
  onChangeComponent?: (componentId: string | undefined) => void
  daysProjection: string
  dataInitialForm?: IdataFormProjection
  dataPromedio?: IDataPromedio
  idEquipoSelected?: string
  idComponentSelected?: string | undefined
  isLoadingData: boolean
  errorMessageModule?: string[]
  datesSampling: { start: string | undefined, end: string | undefined }
}

export interface IDatesLastProjection {
  status?: string
  fecha_start_fill: string
  fecha_end_fill: string
  fecha_start_sampling: string
  fecha_end_sampling: string
  fecha_start_xample: string
  fecha_end_xample: string
  fecha_start_scaling: string
  fecha_end_scaling: string
  fecha_medicion?: string
}
export interface IdataFormProjection {
  type_projection: string | object
  date_project: string
  isDataPercent: string
  trat_sag: string
  vel_rpm: string
  dwi?: string
  bwi?: string
  bolas_ton: string
  tonsForChange: string
  ai: string
  ph: string
  last_date_measurement?: string
  dates_last_projection?: IDatesLastProjection
  equipoId: string
  componenteId: string | undefined
  date_start_scaling?: string
  date_end_scaling?: string
  date_start_fill?: string
  date_project_start?: string
  date_last_medition?: string
}

export interface IDataPromedio {
  BOLAS_TON: string
  DWI?: string
  TRAT_MOLINO: string
  VEL_RPM?: string
  BWI?: string
  AI: string
  PH: string
}

const optionsTypeProjection = [
  {
    label: "30 últimos días",
    value: "projection30Days"
  },
  {
    label: "Campaña completa",
    value: "projectionComplete"
  }
]

const optionsTypeData = [
  {
    label: "Númerico",
    value: "false"
  },
  {
    label: "Porcentual",
    value: "true"
  }
]

const findOptionsTypeProjection = (selectedOption: string) => {
  const isSelectedOption = (element: { label: string, value: string }) => element.value == selectedOption;
  const indexSelected = optionsTypeProjection.findIndex(isSelectedOption)
  return indexSelected > 0 ? indexSelected : 0;
}

const FormProjection = ({
  onSubmit,
  isSaving,
  isLoadingData,
  textButtonSubmit,
  lastDateProjection,
  dateFillEnd,
  typeProjection,
  onChangeDate,
  onChangeTypeProjection,
  onChangeEquipo,
  onChangeComponent,
  daysProjection,
  dataInitialForm,
  dataPromedio,
  idComponentSelected,
  idEquipoSelected,
  errorMessageModule,
  datesSampling }: IProps) => {

  /*STATES */
  const [showLabelPercent, setShowLabelPercent] = useState<boolean>(false);
  const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([]);
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [tipoEquipoSelected, setTipoEquipoSelected] = useState<string | undefined>(undefined);

  /*HOOKS */
  const { title } = useLocalization();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, register, watch, errors, control, setValue, getValues } = useForm<IdataFormProjection>({
    mode: "onSubmit",
    submitFocusError: true,
    defaultValues: {
      trat_sag: dataInitialForm ? dataInitialForm.trat_sag : "",
      vel_rpm: dataInitialForm ? dataInitialForm.vel_rpm : "",
      dwi: dataInitialForm ? dataInitialForm.dwi : "",
      bwi: dataInitialForm ? dataInitialForm.bwi : "",
      ai: dataInitialForm ? dataInitialForm.ai : "",
      ph: dataInitialForm ? dataInitialForm.ph : "",
      bolas_ton: dataInitialForm ? dataInitialForm.bolas_ton : "",
      tonsForChange: dataInitialForm ? dataInitialForm.tonsForChange : "",
      isDataPercent: dataInitialForm ? dataInitialForm.isDataPercent : showLabelPercent.toString(),
      type_projection: dataInitialForm
        ? optionsTypeProjection[findOptionsTypeProjection(dataInitialForm.type_projection as string)]
        : optionsTypeProjection[findOptionsTypeProjection(typeProjection)],
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected,
    }
  });

  const watchFields = watch(["trat_sag", "dwi", "bolas_ton", "vel_rpm", "bwi", "ai", "ph"]);

  //handles
  const updateComponentes = async (equipoId: string) => {
    setLoadingComponent(true);
    await ax.get<IComponente[]>('service_render/componentes/componentes_with_data',
      { params: { equipo_id: equipoId, typeData: 'SIMULATED' } })
      .then((response) => {
        setComponentsForTraining(response.data);
        setValue([{ componenteId: '-1' }]);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.load', { element: "componentes" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => { setLoadingComponent(false) });
  }

  const mappedSubmit = (data: IdataFormProjection) => {
    if (data["isDataPercent"] === "true") {
      data["trat_sag"] && (data["trat_sag"] = Utils.fixed(
        Number(dataPromedio?.TRAT_MOLINO) +
        ((Number(watchFields["trat_sag"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.TRAT_MOLINO)) / 100)
      ).toString())

      watchFields["dwi"] && (data["dwi"] = Utils.fixed(
        Number(dataPromedio?.DWI) +
        ((Number(watchFields["dwi"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.DWI)) / 100)
      ).toString())

      watchFields["bwi"] && (data["bwi"] = Utils.fixed(
        Number(dataPromedio?.BWI) +
        ((Number(watchFields["bwi"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.BWI)) / 100)
      ).toString())

      data["bolas_ton"] && (data["bolas_ton"] = Utils.fixed(
        Number(dataPromedio?.BOLAS_TON) +
        ((Number(watchFields["bolas_ton"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.BOLAS_TON)) / 100)
      ).toString())

      data["vel_rpm"] && (data["vel_rpm"] = Utils.fixed(
        Number(dataPromedio?.VEL_RPM) +
        ((Number(watchFields["vel_rpm"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.VEL_RPM)) / 100)
      ).toString())

      data["ai"] && (data["ai"] = Utils.fixed(
        Number(dataPromedio?.AI) +
        ((Number(watchFields["ai"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.AI)) / 100)
      ).toString())

      data["ph"] && (data["ph"] = Utils.fixed(
        Number(dataPromedio?.PH) +
        ((Number(watchFields["ph"].replace(ONLY_NUMBER, '')) *
          Number(dataPromedio?.PH)) / 100)
      ).toString())

    }
    onSubmit(data)
  }

  useEffect(() => {
    setShowLabelPercent(getValues('isDataPercent') === "true")
  }, [getValues('isDataPercent')]);

  return (<form onSubmit={handleSubmit(mappedSubmit)}>
    <Row className='text-left mt-2'>
      <Col sm={3} className='text-left mb-2'>
        <Controller
          as={ApiSelect}
          control={control}
          label="Equipo"
          name='equipoId'
          placeholder='Seleccione ...'
          source={'service_render/equipos'}
          selector={(option: any) => {
            return { label: option.nombre, value: option.id.toString(), tipo: option.equipo_tipo.nombre_corto };
          }}
          value={idEquipoSelected}
          valueInObject={true}
          onChange={(data: any) => {
            if (data[0].value) {
              setValue([{ 'componenteId': undefined }])
              updateComponentes(data[0].value)
              setTipoEquipoSelected(data[0].tipo)
              onChangeEquipo !== undefined && onChangeEquipo(data[0].value)
              return data[0].value;
            }
          }}
          rules={{ required: { value: true, message: 'Complete este campo' } }}
        />
        {errors.equipoId && <small className='text-danger'>
          {errors.equipoId.message}
        </small>}
      </Col>
      <Col sm={3} className='text-left mb-2'>
        <Controller
          as={ApiSelect}
          label={"Componente"}
          control={control}
          name='componenteId'
          placeholder='Seleccione ...'
          source={componentsForTraining}
          defaultValue={'-1'}
          selector={(option: any) => {
            return { label: option.nombre, value: option.id.toString() };
          }}
          onChange={(data) => {
            onChangeComponent !== undefined && onChangeComponent(data[0])
            return data[0];
          }}
          rules={{ required: caps('validations:required') }}
          isLoading={loadingComponent}
          isDisabled={loadingComponent}
          errors={componentsForTraining.length == 0 ? ['El equipo seleccionado no tiene componentes entrenados'] : []}
        />
        {errors.equipoId && <small className='text-danger'>
          {errors.equipoId.message}
        </small>}
      </Col>
      <Col sm={2} className='text-left mb-2'>
        <label><strong>Periodo:</strong></label>
        <Controller
          id="type_projection"
          name="type_projection"
          control={control}
          as={Select}
          onChange={(data) => {
            onChangeTypeProjection !== undefined && onChangeTypeProjection(data[0].value)
            return data[0];
          }}
          rules={{ required: { value: true, message: 'Complete este campo' } }}
          options={optionsTypeProjection}
        />
        {errors.type_projection && <small className='text-danger'>
          {errors.type_projection.message}
        </small>}
      </Col>
      {(!isLoadingData && idComponentSelected && idComponentSelected !== "-1") && (<>
        <Col sm={2} className='text-left mb-2'>
          <label><b>Fecha inicial del periodo:</b></label>
          <Controller control={control}
            name="date_sampling_start"
            readonly={true}
            defaultValue={datesSampling.start}
            rules={{ required: caps('validations:required') }}
            as={Datepicker}
          />
          <ErrorMessage errors={errors} name="date_sampling_start">
            {({ message }) => <small className={'text-danger'}>{message}</small>}
          </ErrorMessage>
        </Col>
        <Col sm={2} className='text-left mb-2'>
          <label><b>Fecha final del periodo:</b></label>
          <Controller control={control}
            name="date_sampling_end"
            readonly={true}
            defaultValue={datesSampling.end}
            rules={{ required: caps('validations:required') }}
            as={Datepicker}
          />
          <ErrorMessage errors={errors} name="date_sampling_end">
            {({ message }) => <small className={'text-danger'}>{message}</small>}
          </ErrorMessage>
        </Col>
      </>)}
    </Row>
    {isLoadingData ? <LoadingSpinner /> : (
      idComponentSelected && idComponentSelected !== "-1" && (<>
        <Row className='text-left mt-2'>
          <Col sm={2} className='text-left mb-2'>
            <label><b>Fecha de última medición :</b></label>
            <Controller control={control}
              name="date_last_medition"
              readonly={true}
              defaultValue={lastDateProjection}
              rules={{ required: caps('validations:required') }}
              as={Datepicker} />
            <ErrorMessage errors={errors} name="date_last_medition">
              {({ message }) => <small className={'text-danger'}>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={2} className='text-left mb-2'>
            <label><b>Fecha final de proyección:</b></label>
            <Controller control={control}
              name="date_project_end"
              minDate={($m(lastDateProjection, 'DD-MM-YYYY').add(5, 'days')).format('DD-MM-YYYY')}
              maxDate={($m(lastDateProjection, 'DD-MM-YYYY').add(90, 'days')).format('DD-MM-YYYY')}
              onChange={(e) => {
                onChangeDate !== undefined && onChangeDate(e[0])
                return e[0]
              }}
              defaultValue={dateFillEnd}
              rules={{ required: caps('validations:required') }}
              as={Datepicker} />
            <ErrorMessage errors={errors} name="date_project_end">
              {({ message }) => <small className={'text-danger'}>{message}</small>}
            </ErrorMessage>
          </Col>

          <Col sm={2} className='text-left mb-2'>
            <Textbox
              id='days_project'
              name='days_project'
              label={'forms:inputs.days_project'}
              readonly={true}
              value={daysProjection} />
          </Col>
        </Row>
        {(errorMessageModule && errorMessageModule?.length > 0) ? (
          <ShowMessageInModule className="pt-4" message={errorMessageModule} />
        ) : (
          <Row className='text-left mt-2'>
            <Col sm={12} >
              <Card>
                <Card.Body>
                  <Row className={"d-flex align-items-center"}>
                    <Col sm={6}><h4>{title("variable_simulation")}</h4></Col>
                    <Col sm={6} className="d-flex justify-content-sm-end mt-sm-0 mt-3">
                      <Controller
                        name="isDataPercent"
                        style={{ display: "inline" }}
                        control={control}
                        as={RadioSelect}
                        options={optionsTypeData}
                        onChange={(value) => {
                          setShowLabelPercent(value[0] === "true")
                          return value[0]
                        }}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={4} className={"d-flex align-items-center "}>
                      <Col sm={6}>
                        <Col sm={12}>
                          <strong>Tonelaje procesado </strong>
                        </Col>
                        <Col sm={12}>
                          <strong>({dataPromedio?.TRAT_MOLINO} Ton/día)</strong>
                        </Col>
                      </Col>
                      <Col sm={6}>
                        <div className='d-flex align-items-center'>
                          <Textbox id="trat_sag" name="trat_sag" onlyNumber={true} ref={register()} />
                          {showLabelPercent && <span className="ml-2">%</span>}

                        </div>
                        {(showLabelPercent && watchFields["trat_sag"] !== ""
                          && !isNaN(Number(watchFields["trat_sag"]))) && (
                            <Col sm={12} className="text-center pl-0">
                              <span >
                                {Utils.fixed(
                                  Number(dataPromedio?.TRAT_MOLINO) +
                                  ((Number(watchFields["trat_sag"].replace(ONLY_NUMBER, '')) *
                                    Number(dataPromedio?.TRAT_MOLINO)) / 100))
                                } Ton/día
                              </span>
                            </Col>
                          )}
                      </Col>
                    </Col>
                    <Col className="d-sm-none d-block">
                      <hr />
                    </Col>
                    <Col sm={4} className={"d-flex align-items-center mt-2 mt-sm-0"}>
                      <Col sm={6}>
                        <Col sm={12}>
                          <strong>Dureza DWI </strong>
                        </Col>
                        <Col sm={12}>
                          <strong>({dataPromedio?.DWI} DWI)</strong>
                        </Col>
                      </Col>
                      <Col sm={6}>
                        <div className='d-flex align-items-center'>
                          <Textbox id="dwi" name="dwi" onlyNumber={true} ref={register()} />
                          {showLabelPercent && <span className="ml-2">%</span>}
                        </div>
                        {(showLabelPercent && watchFields["dwi"] && watchFields["dwi"] !== ""
                          && !isNaN(Number(watchFields["dwi"]))) && (
                            <Col sm={12} className="text-center pl-0">
                              <span >
                                {Utils.fixed(
                                  Number(dataPromedio?.DWI) +
                                  ((Number(watchFields["dwi"].replace(ONLY_NUMBER, '')) *
                                    Number(dataPromedio?.DWI)) / 100))
                                } DWI
                              </span>
                            </Col>
                          )}
                      </Col>
                    </Col>
                    <Col className="d-sm-none d-block">
                      <hr />
                    </Col>
                    <Col sm={4} className={"d-flex align-items-center mt-2 mt-sm-0"}>
                      <Col sm={6}>
                        <Col sm={12}>
                          <strong>Dureza BWI </strong>
                        </Col>
                        <Col sm={12}>
                          <strong>({dataPromedio?.BWI} BWI)</strong>
                        </Col>
                      </Col>
                      <Col sm={6}>
                        <div className='d-flex align-items-center'>
                          <Textbox id="bwi" name="bwi" onlyNumber={true} ref={register()} />
                          {showLabelPercent && <span className="ml-2">%</span>}
                        </div>
                        {(showLabelPercent && watchFields["bwi"] && watchFields["bwi"] !== ""
                          && !isNaN(Number(watchFields["bwi"]))) && (
                            <Col sm={12} className="text-center pl-0">
                              <span >
                                {Utils.fixed(
                                  Number(dataPromedio?.BWI) +
                                  ((Number(watchFields["bwi"].replace(ONLY_NUMBER, '')) *
                                    Number(dataPromedio?.BWI)) / 100))
                                } BWI
                              </span>
                            </Col>
                          )}
                      </Col>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm={4} className={"d-flex align-items-center mt-2 mt-sm-0 "}>
                      <Col sm={6}>
                        <Col sm={12}>
                          <strong>Carguío Bolas </strong>
                        </Col>
                        <Col sm={12}>
                          <strong>({dataPromedio?.BOLAS_TON} Ton/día)</strong>
                        </Col>
                      </Col>
                      <Col sm={6}>
                        <div className='d-flex align-items-center'>
                          <Textbox id="bolas_ton" name="bolas_ton" onlyNumber={true} ref={register()} />
                          {showLabelPercent && <span className="ml-2">%</span>}
                        </div>
                        {(showLabelPercent && watchFields["bolas_ton"] !== ""
                          && !isNaN(Number(watchFields["bolas_ton"]))) && (
                            <Col sm={12} className="text-center pl-0">
                              <span >
                                {Utils.fixed(
                                  Number(dataPromedio?.BOLAS_TON) +
                                  ((Number(watchFields["bolas_ton"].replace(ONLY_NUMBER, '')) *
                                    Number(dataPromedio?.BOLAS_TON)) / 100))
                                } Ton/día
                              </span>
                            </Col>
                          )}
                      </Col>
                    </Col>
                    <Col className="d-sm-none d-block">
                      <hr />
                    </Col>
                    <Col sm={4} className={"d-flex align-items-center "}>
                      <Col sm={6}>
                        <Col sm={12}>
                          <strong>Índice de abrasividad</strong>
                        </Col>
                        <Col sm={12}>
                          <strong>({dataPromedio?.AI} AI )</strong>
                        </Col>
                      </Col>
                      <Col sm={6}>
                        <div className='d-flex align-items-center'>
                          <Textbox id="ai" name="ai" onlyNumber={true} ref={register()} />
                          {showLabelPercent && <span className="ml-2">%</span>}

                        </div>
                        {(showLabelPercent && watchFields["ai"] !== ""
                          && !isNaN(Number(watchFields["ai"]))) && (
                            <Col sm={12} className="text-center pl-0">
                              <span >
                                {Utils.fixed(
                                  Number(dataPromedio?.AI) +
                                  ((Number(watchFields["ai"].replace(ONLY_NUMBER, '')) *
                                    Number(dataPromedio?.AI)) / 100))
                                }
                              </span>
                            </Col>
                          )}
                      </Col>
                    </Col>

                    <Col className="d-sm-none d-block">
                      <hr />
                    </Col>

                    <Col sm={4} className={"d-flex align-items-center "}>
                      <Col sm={6}>
                        <Col sm={12}>
                          <strong>PH </strong>
                        </Col>
                        <Col sm={12}>
                          <strong>({dataPromedio?.PH})</strong>
                        </Col>
                      </Col>
                      <Col sm={6}>
                        <div className='d-flex align-items-center'>
                          <Textbox id="ph" name="ph" onlyNumber={true} ref={register()} />
                          {showLabelPercent && <span className="ml-2">%</span>}
                        </div>
                        {(showLabelPercent && watchFields["ph"] !== ""
                          && !isNaN(Number(watchFields["ph"]))) && (
                            <Col sm={12} className="text-center pl-0">
                              <span >
                                {Utils.fixed(
                                  Number(dataPromedio?.PH) +
                                  ((Number(watchFields["ph"].replace(ONLY_NUMBER, '')) *
                                    Number(dataPromedio?.PH)) / 100))
                                }
                              </span>
                            </Col>
                          )}
                      </Col>
                    </Col>
                  </Row>

                  {tipoEquipoSelected !== "MOBO" && (<>
                    <hr />

                    <Row>
                      <Col sm={4} className={"d-flex align-items-center "}>
                        <Col sm={6}>
                          <Col sm={12}>
                            <strong>Velocidad</strong>
                          </Col>
                          <Col sm={12}>
                            <strong>({dataPromedio?.VEL_RPM} RPM)</strong>
                          </Col>
                        </Col>
                        <Col sm={6}>
                          <div className='d-flex align-items-center'>
                            <Textbox id="vel_rpm"
                              name="vel_rpm"
                              onlyNumber={true}
                              ref={register()}
                            // readonly={dataPromedio?.VEL_RPM === undefined}
                            />
                            {showLabelPercent && <span className="ml-2">%</span>}
                          </div>
                          {(showLabelPercent && watchFields["vel_rpm"] !== ""
                            && !isNaN(Number(watchFields["vel_rpm"]))) && (
                              <Col sm={12} className="text-center pl-0">
                                <span >
                                  {Utils.fixed(
                                    Number(dataPromedio?.VEL_RPM) +
                                    ((Number(watchFields["vel_rpm"].replace(ONLY_NUMBER, '')) *
                                      Number(dataPromedio?.VEL_RPM)) / 100))
                                  } RPM
                                </span>
                              </Col>
                            )}
                        </Col>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} className="mt-3"><h4>{title("changes_of_senses")}</h4>
                        <hr />
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={4} xs={12} className={"d-flex align-items-center "}>
                        <Col sm={6}>
                          <Col sm={12}>
                            <strong>Toneladas para cambio</strong>
                          </Col>
                        </Col>

                        <Col sm={6}>
                          <Textbox
                            id="tonsForChange" name="tonsForChange"
                            format="NUMBER-SEPARATOR"
                            ref={register()}
                          />
                        </Col>
                      </Col>
                      <Col sm={8} xs={12} className="mt-sm-0 mt-4">
                        <div className="alert alert-info mb-0" >
                          <i className="fa fa-info mr-2" aria-hidden="true" />
                          Especificar cada cuantas toneladas se desea realizar el cambio de sentido de giro
                        </div>
                      </Col>
                    </Row>

                  </>)}

                </Card.Body>
              </Card>
            </Col>
          </Row>
        )
        }

        <Row>
          <Col sm={12} className="d-flex justify-content-end">
            <Button type={"submit"}
              disabled={isSaving || (errorMessageModule && errorMessageModule?.length > 0)} >
              {textButtonSubmit}
            </Button>
          </Col>
        </Row>
      </>))}
  </form>);
}

export default FormProjection;
