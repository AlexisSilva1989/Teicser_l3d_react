import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Col, Form, Row } from 'react-bootstrap';
import { Chart } from 'react-charts'
import { useToasts } from 'react-toast-notifications';

import { useFullIntl } from '../../../../Common/Hooks/useFullIntl';
import { ax } from '../../../../Common/Utils/AxiosCustom';
import { LoadingSpinner } from '../../../../Components/Common/LoadingSpinner';
import { ShowMessageInModule } from '../../../../Components/Common/ShowMessageInModule';

interface IProps {
    resourceData: string
}

const SimulacionGrafica = ({ resourceData }: IProps) => {

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
        { primary: true, position: "top", type: "linear", show: false },
        { position: "left", type: "linear", show: false, stacked: false }
    ], []
    );
    const series = useMemo(() => ({ type: "area" }), []);
    const getSeriesStyle = useCallback(series => ({ color: "#003be7" }), [])
    const data = useMemo(() => [{ data: dataSimulacionSize > 0 ? dataSimulacion[rangeSelected] : [] }],
        [rangeSelected, dataSimulacion]
    )

    return (<>
        {loadingData ? <LoadingSpinner /> :
            dataSimulacionSize > 0 ? 
                (<>
                    {/* <Col xl='4'>

                    </Col> */}

                    <Col xl='12'>
                        <Form.Group as={Row}>
                            <Form.Label column sm="3" className={'justify-content-end'} style={{ 'display': 'flex' }}> 02/03/2021 </Form.Label>
                            <Col sm="6">
                                <Form.Control value={rangeSelected} type="range"
                                    min={1} max={dataSimulacionSize}
                                    onChange={e => setRangeSelected(Number(e.target.value))}
                                />
                            </Col>
                            {/* <Col sm="1">
                                <Form.Control value={rangeSelected} size='sm' onChange={e => setRangeSelected(Number(e.target.value))}/>
                            </Col> */}
                            <Form.Label column sm="3"> 30/03/2021 </Form.Label>
                        </Form.Group>

                        <Col sm="12" style={{ height: '250px', marginBottom: '10%' }}>
                            <Chart data={data} axes={axes} series={series} getSeriesStyle={getSeriesStyle} />

                        </Col>
                    </Col>
                </>)
            : <ShowMessageInModule message='No se ha encotrado data de simulación' />}

    </>);
}

export default SimulacionGrafica;
