import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Chart } from 'react-charts'
import { useToasts } from 'react-toast-notifications';

import { useFullIntl } from '../../../../Common/Hooks/useFullIntl';
import { ax } from '../../../../Common/Utils/AxiosCustom';
import { LoadingSpinner } from '../../../../Components/Common/LoadingSpinner';
import { ShowMessageInModule } from '../../../../Components/Common/ShowMessageInModule';
import { IdataFormProjection,IDatesLastProjection } from '../Projection/FormProjection';

interface IProps {
    resourceData: string
    dataForm?: IdataFormProjection
    returnFunction?: () => void
    showLegend?: boolean
    dateStart?: string
    dateEnd?: string
}

const styleListOperationalVar : React.CSSProperties = { 'display': 'flex', 'justifyContent':'center'}

const SimulacionGrafica = ({ resourceData, dataForm, returnFunction, showLegend = true, dateStart, dateEnd}: IProps) => {
    
    /*CUSTOM HOOKS */
    const { capitalize: caps } = useFullIntl();
    const { addToast } = useToasts();

    /*STATES */
    const [loadingData, setLoadingData] = useState(true);
    const [rangeSelected, setRangeSelected] = useState(1);
    const [dataSimulacion, setDataSimulacion] = useState<any>();
    const [dataSimulacionSize, setDataSimulacionSize] = useState<number>(0);

    /*EFFECTS */
    useEffect(() => {
        async function feat() {
            await ax.get<{ simulacion: string[] }>(resourceData).then(response => {
                if (response.data.simulacion.length > 0) {
                    setDataSimulacionSize(Object.keys(response.data.simulacion[0]).length)
                    setDataSimulacion(response.data.simulacion[0]);
                }
                setLoadingData(false);
            }).catch((error: AxiosError) => {
                if (error.response) {
                    addToast(caps('errors:base.load', { element: 'data de simulación' }), { appearance: 'error', autoDismiss: true });
                }
            });
        }
        feat();
    }, []);

    /*MEMOS */  
    const axes = useMemo(() => [
            { primary: true, position: "bottom", type: "linear", show: true ,  showTicks: false},
            { position: "left", type: "linear", show: true, stacked: false, hardMin: 0, hardMax: 260 ,  showTicks: false},
        ], []
    );
    const series = useMemo(() => ({ type: "area" }), []);
    const getSeriesStyle = useCallback(series => ({ color: "#003be7" }), [])
    const data = useMemo(() => [{ data: dataSimulacionSize > 0 ? dataSimulacion[rangeSelected] : [] }],[rangeSelected, dataSimulacion])

    /*LEYENDA DE LA GRAFICA */
    const legendGraph : JSX.Element = <>
        <Col xl='4' className="mt-2">
            <Row className="mb-3 justify-content-center" style={{ 'display': 'flex' }}>
                <p> Simulación realizada con <b>últimos 30 días</b></p>
            </Row>
            <Row>
                {dataForm?.trat_sag && <Col xl='6' className="mb-2" style={styleListOperationalVar }>
                    <p> Tonelaje <b>{dataForm.trat_sag}</b></p>
                </Col>}

                {dataForm?.vel_rpm && <Col xl='6' className="mb-2" style={styleListOperationalVar}>
                    <p> Velocidad <b>{dataForm.vel_rpm}</b></p>
                </Col>}
                
                {dataForm?.dwi && <Col xl='6' className="mb-2" style={styleListOperationalVar}>
                    <p> Dureza <b>{dataForm.dwi}</b> </p>
                </Col>}

                {dataForm?.bolas_ton && <Col xl='6' className="mb-2" style={styleListOperationalVar}>
                    <p> Cargío bolas <b>{dataForm.bolas_ton}</b></p>
                </Col>}
            </Row>
            <Row style={{ 'display': 'flex' }} className={'justify-content-center mt-3'}>
                <Button variant='outline-info' className='mr-3' onClick={returnFunction}>
                    Cambiar datos de simulación
                </Button>
            </Row>
        </Col>
    </>

    /*COMPOSICION DE LA GRAFICA */
    const graph : JSX.Element = <>
        <Col xl='6'>
            <Col sm="12" style={{ height: '250px'}}>
                <Chart data={data} axes={axes} series={series} getSeriesStyle={getSeriesStyle} />
            </Col>
            <Form.Group as={Row}>
                <Form.Label column sm="3" className={'text-right'}> 
                    {dateStart}
                </Form.Label>
                <Col sm="6">
                    <Form.Control value={rangeSelected} type="range"
                        min={1} max={dataSimulacionSize}
                        onChange={e => setRangeSelected(Number(e.target.value))}
                    />
                </Col>
                <Form.Label column sm="3"> 
                    {dateEnd} 
                </Form.Label>
            </Form.Group>
        </Col>
    </>
 
    return (<>
        {loadingData ? <LoadingSpinner /> :
            dataSimulacionSize > 0 ? (<>
                <Col xl='12' className="justify-content-center" style={{ 'display': 'flex' }}>
                    {graph}
                    {showLegend && legendGraph}
                </Col>
            </>)
            : <ShowMessageInModule message='No se ha encotrado data de simulación' />
        }
    </>);
}

export default SimulacionGrafica;
