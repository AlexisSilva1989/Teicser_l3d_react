import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { Datepicker } from '../../../Forms/Datepicker';
import { RadioSelect } from '.././../../../Components/Forms/RadioSelect';
import { useLocalization } from '../../../../Common/Hooks/useLocalization';
import Select from 'react-select';
import { $m } from '../../../../Common/Utils/Reimports';
import { Textbox } from '../../../Forms/Textbox';
import { ApiSelect } from '../../../Api/ApiSelect';

interface IProps {
    onSubmit: (data: IdataFormProjection) => void
    lastDateProjection: string | undefined
    isSaving?: boolean
    textButtonSubmit?: string
    dateFillEnd:string | undefined
    typeProjection: string
    onChangeDate?: (dateFill : string) => void
    onChangeTypeProjection?: (typeProjection : string) => void
    onChangeEquipo?: (equipoId : string) => void
    daysProjection:string
    dataInitialForm?: IdataFormProjection
    dataPromedio? : IDataPromedio,
    idEquipoSelected?: string
}

export interface IDatesLastProjection {
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
    dwi: string
    bolas_ton: string
    tonsForChange: string
    last_date_measurement?: string
    dates_last_projection? : IDatesLastProjection
    equipoId : string
}

export interface IDataPromedio {
	BOLAS_TON: string
	DWI: string
	TRAT_SAG_1011: string
	VEL_RPM: string
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

const findOptionsTypeProjection = (selectedOption : string) =>{
    const isSelectedOption = (element : {  label: string, value: string}) => element.value == selectedOption;
    const indexSelected = optionsTypeProjection.findIndex(isSelectedOption)
    return indexSelected > 0 ? indexSelected : 0;
}

const FormProjection = ({
    onSubmit, 
    isSaving, 
    textButtonSubmit,
    lastDateProjection, 
    dateFillEnd ,
    typeProjection,
    onChangeDate,
    onChangeTypeProjection,
    onChangeEquipo,
    daysProjection,
    dataInitialForm,
    dataPromedio,
    idEquipoSelected }:IProps) => {
    
    /*STATES */
    const [showLabelPercent, setShowLabelPercent] = useState<boolean>();

    /*HOOKS */
    const { input, title } = useLocalization();
    const { handleSubmit, register, errors, control, setValue, getValues } = useForm<IdataFormProjection>({
        mode: "onSubmit",
        submitFocusError: true,
        defaultValues:{
            trat_sag : dataInitialForm ? dataInitialForm.trat_sag : "",
            vel_rpm : dataInitialForm ? dataInitialForm.vel_rpm : "",
            dwi : dataInitialForm ? dataInitialForm.dwi : "",
            bolas_ton : dataInitialForm ? dataInitialForm.bolas_ton : "",
            tonsForChange : dataInitialForm ? dataInitialForm.tonsForChange : "",
            isDataPercent: dataInitialForm ? dataInitialForm.isDataPercent : "false",
            type_projection : dataInitialForm 
                ? optionsTypeProjection[findOptionsTypeProjection(dataInitialForm.type_projection as string)] 
                : optionsTypeProjection[findOptionsTypeProjection(typeProjection)],
            equipoId :  idEquipoSelected
        }
    });
{console.log('dataInitialForm ',dataInitialForm)}
    /*EFFECTS */
    useEffect(() => {
        dateFillEnd !== undefined && setValue('date_project',dateFillEnd);
    },[dateFillEnd]);

    useEffect(() => {
        setShowLabelPercent(getValues('isDataPercent') === "true")
    },[]);

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <Row className='text-left mt-2'>
            <Col sm={2} className='text-left mb-2'>
                <label><b>Equipo:</b></label>
                <Controller
                    as={ApiSelect}
                    control={control}
                    name='equipoId'
                    placeholder='Seleccione Equipo'
                    source={'service_render/equipos'}
                    selector={(option: any) => {
                        return { display: option.nombre, value: option.id.toString() };
                    }}
                    value={idEquipoSelected}
                    onChange={ (data) => {
                        onChangeEquipo !== undefined && onChangeEquipo(data[0])
                        return data[0];
                    }}
                    rules={{ required: {value:true, message:'Complete este campo'} }}
                />
                {errors.equipoId && <small className='text-danger'>
                  {errors.equipoId.message}
                </small>}
            </Col>
            <Col sm={2} className='text-left mb-2'>
                <label><b>Variables de proyección:</b></label>
                <Controller
                    id="type_projection"
                    name="type_projection"
                    control={control}
                    as =  {Select}
                    onChange={(data)=>{
                        onChangeTypeProjection !== undefined && onChangeTypeProjection(data[0].value)
                        return data[0];
                    }}
                    rules={{ required: {value:true, message:'Complete este campo'} }}
                    options={optionsTypeProjection}
                />
                {errors.type_projection && <small className='text-danger'>
                  {errors.type_projection.message}
                </small>}
            </Col>

            <Col sm={2} className='text-left mb-2'>
                <label><b>{input('date_project')}:</b></label>
                <Controller control={control} 
                    name="date_project" 
                    minDate={($m(lastDateProjection,'DD-MM-YYYY').add(1, 'days')).format('DD-MM-YYYY')}
                    maxDate={($m(lastDateProjection,'DD-MM-YYYY').add(35, 'days')).format('DD-MM-YYYY')}
                    onChange={(e)=>{
                        onChangeDate !== undefined && onChangeDate(e[0])
                    }} 
                    as={Datepicker} />
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

        <Row className='text-left mt-2'>
            <Col sm={6} >
                <Card>
                    <Card.Body>
                        <Col sm={6}><h4>{title("variable_simulation")}</h4></Col>
                        <Col sm={6}>
                            <Controller
                                name="isDataPercent"
                                style={{ display: "inline" }}
                                control={control}
                                as =  {RadioSelect}
                                options={optionsTypeData}
                                onChange={(value)=>{
                                    setShowLabelPercent(value[0] === "true")
                                    return value[0]
                                }}
                            />
                        </Col>
                        
                        <hr/>
                        <Col sm={4}>Tonelaje a procesado</Col>
                        <Col sm={4}>
                            <div className='d-flex align-items-center'>
                                <Textbox id="trat_sag" name="trat_sag" onlyNumber={true} ref={register()}/>
                                {showLabelPercent && <span className="ml-2">%</span>}
                            </div>
                        </Col>
                        <Col sm={4}> <strong>{dataPromedio?.TRAT_SAG_1011} Ton/día</strong>	</Col>
                        
                        <hr/>
                        <Col sm={4}>Velocidad</Col>
                        <Col sm={4}>
                            <div className='d-flex align-items-center'>
                                <Textbox id="vel_rpm" name="vel_rpm" onlyNumber={true} ref={register()}/>
                                {showLabelPercent && <span className="ml-2">%</span>}
                            </div>
                        </Col>
                        <Col sm={4}> <strong>{dataPromedio?.VEL_RPM} RPM</strong></Col>

                        <hr/>
                        <Col sm={4}>Dureza DWI</Col>
                        <Col sm={4}>
                            <div className='d-flex align-items-center'>
                                <Textbox id="dwi" name="dwi" onlyNumber={true} ref={register()}/>
                                {showLabelPercent && <span className="ml-2">%</span>}
                            </div>
                        </Col>
                        <Col sm={4}><strong>{dataPromedio?.DWI} DWI</strong></Col>

                        <hr/>
                        <Col sm={4}>Carguío Bolas</Col>
                        <Col sm={4}>
                            <div className='d-flex align-items-center'>
                                <Textbox id="bolas_ton" name="bolas_ton" onlyNumber={true} ref={register()}/>
                                {showLabelPercent && <span className="ml-2">%</span>}
                            </div>
                        </Col>
                        <Col sm={4}><strong>{dataPromedio?.BOLAS_TON} Ton/día</strong></Col>
                    </Card.Body>
                </Card>
            </Col>

            <Col sm={6}>
                <Card style={{ height: "90%"}}>
                    <Card.Body>
                        <Col sm={12}><h4>{title("changes_of_senses")}</h4></Col>
                        <hr/>
                        <Col sm={8}>Toneladas para cambio de sentido de giro</Col>
                        <Col sm={4}><Textbox id="tonsForChange" name="tonsForChange" 
                            format="NUMBER-SEPARATOR"
                            ref={register()}/></Col>
                    </Card.Body>
                </Card>
            </Col> 

            <Col sm={2} className="offset-10">
                <Button type={"submit"} disabled={isSaving} className='d-flex justify-content-start btn-primary mr-3 mt-5'>
                    {textButtonSubmit}
                </Button>
            </Col>
        </Row>
    </form>);
}

export default FormProjection;
