import React from 'react';
import { Col } from 'react-bootstrap';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
    dataCharts : any[]
}

export const DasboardHomeGraphs = ( {dataCharts} : Props) => {

    /*CUSTOM HOOKS */
    const { capitalize: caps } = useFullIntl();

    return (<>
        {/*GRAFICA DE TRABAJOS REALIZADOS */}
        <Col xl={12} className='mt-4 justify-content-center d-flex'>
            <h4>{caps('labels:charts.mobile_year')}</h4>
        </Col>
        <Col xl={12} className='mt-1'>
            <ResponsiveContainer aspect={3} >
                <LineChart data={dataCharts} margin={{ top: 4, right: 40, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cant" name={caps('labels:charts.trabajos_realizados')} stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Col>
    </>)
}