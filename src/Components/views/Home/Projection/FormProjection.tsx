import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { CustomSelect } from '../../../Forms/CustomSelect';
import { Datepicker } from '../../../Forms/Datepicker';
import { RadioSelect } from '.././../../../Components/Forms/RadioSelect';
import { TextArea } from '../../../../Components/Forms/TextArea';
import { useLocalization } from '../../../../Common/Hooks/useLocalization';
import Select from 'react-select';
import { $m, IMoment } from '../../../../Common/Utils/Reimports';
import { DateUtils } from '../../../../Common/Utils/DateUtils';
import { Textbox } from '../../../Forms/Textbox';

interface IProps {
    onSubmit: (data: IdataFormProjection) => void
    isSaving?: boolean
    textButtonSubmit?: string
    lastDateProjection: string
    maxDateProjection:string | undefined
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
}

const maxDaysToProjection = 35;
const countDaysToProjection = maxDaysToProjection - 5;
const optionsTypeProjection = [
    {
        label: "30 últimos días",
        value: "projection30Days"
    },
    // {
    //     label: "Campaña completa",
    //     value: "projectionComplete"
    // }
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

const FormProjection = ({onSubmit, isSaving, textButtonSubmit,lastDateProjection }:IProps) => {
    /*HOOKS */
    const { input, title } = useLocalization();
    const { handleSubmit, register, errors, control, setValue } = useForm<IdataFormProjection>({
        mode: "onSubmit",
        submitFocusError: true,
    });

    /**STATES */
    const [daysProjection, setDaysProjection] = useState<string>(countDaysToProjection.toString())
    const [dateFillEnd, setDateFillEnd] = useState<string>(
        ($m(lastDateProjection,'DD-MM-YYYY').add(countDaysToProjection, 'days')).format('DD-MM-YYYY')
    )
    
    
    /*EFFECTS */

    /*CALCULAR EL NUMERO DE DIAS A PROYECTAR */
    useEffect(() => {
        setDaysProjection((DateUtils.differenceBetweenDates(lastDateProjection,dateFillEnd)).toString())
	}, [dateFillEnd]);
    
    /*VALUES */
    useEffect(() => {
        setValue('date_project',dateFillEnd);
    },[]);

    return (<form onSubmit={handleSubmit(onSubmit)}>
        
        <Row className='text-left mt-2'>
            <Col sm={2} className='text-left mb-2'>
                <label><b>Variables de proyección:</b></label>
                <Controller
                    id="type_projection"
                    name="type_projection"
                    control={control}
                    defaultValue={optionsTypeProjection[0]}
                    rules={{ required: {value:true, message:'Complete este campo'} }}
                    as =  {Select}
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
                    maxDate={($m(lastDateProjection,'DD-MM-YYYY').add(maxDaysToProjection, 'days')).format('DD-MM-YYYY')}
                    onChange={(e)=>{setDateFillEnd(e[0])}} 
                    as={Datepicker} />
            </Col>

            <Col sm={2} className='text-left mb-2'>
                <Textbox id='days_project' name='days_project' label={'forms:inputs.days_project'} readonly={true} value={daysProjection} />
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
                                defaultValue={"false"}
                                as =  {RadioSelect}
                                options={optionsTypeData}
                            />
                        </Col>
                        
                        <hr/>
                        <Col sm={4}>Tonelaje a procesado</Col>
                        <Col sm={4}><Textbox id="trat_sag" name="trat_sag" ref={register()}/></Col>
                        <Col sm={4}> <strong>Ton/día</strong>	</Col>
                        
                        <hr/>
                        <Col sm={4}>Velocidad</Col>
                        <Col sm={4}><Textbox id="vel_rpm" name="vel_rpm" ref={register()}/></Col>
                        <Col sm={4}> <strong>RPM</strong></Col>

                        <hr/>
                        <Col sm={4}> Dureza DWI</Col>
                        <Col sm={4}><Textbox id="dwi" name="dwi" ref={register()}/></Col>
                        <Col sm={4}><strong>DWI</strong></Col>

                        <hr/>
                        <Col sm={4}>Carguío Bolas</Col>
                        <Col sm={4}><Textbox id="bolas_ton" name="bolas_ton" ref={register()}/></Col>
                        <Col sm={4}><strong>Ton/día</strong></Col>

                    </Card.Body>
                </Card>
            </Col>

            <Col sm={6}>
                <Card style={{ height: "90%"}}>
                    <Card.Body>
                        <Col sm={12}><h4>{title("changes_of_senses")}</h4></Col>
                        
                        <hr/>
                        <Col sm={8}>Toneladas para cambio de sentido de giro</Col>
                        <Col sm={4}><Textbox id="tonsForChange" name="tonsForChange" ref={register()}/></Col>
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
