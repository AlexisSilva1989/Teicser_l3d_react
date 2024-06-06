import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';

const iconStyle = {
    color: '#ffba57'
}

interface dataTargets {
    cotAbiertas: number,
    cotPendienteAprobacion: number,
    trabajosProceso: number,
    hhPendiente: number,
    trabajosFacturar: number,
    cobranzasPendientes: number,
    comprasPendientes: number,
    comprasCamino: number,
    consumosNoCotizados: number,
    ajustesInventario: number,
}

interface Props {
    dataTargets: dataTargets
}

export const DasboardHomeTargets = ({dataTargets} : Props) => {

    /*CUSTOM HOOKS */
    const { capitalize: caps } = useFullIntl();

    return (<>
        {/* TARJETAS PRINCIPALES */}
        <Col xl={12} className='mt-3 justify-content-around d-xl-flex' >
            <Card bg='light' text='dark' className='widget-visitor-card my-2 p-0 m-2' style={{width:'100%'}}>
                <Card.Body className='text-center'>
                    <p className='h3 font-weight-bold' >{caps('labels:common.comercial')}</p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.cot_abiertas')}: {dataTargets.cotAbiertas}</p>
                    <p className='h5 font-weight-bold'>{caps('columns:requested_stock')}: {dataTargets.cotPendienteAprobacion}</p>
                    <i className='fas fa-business-time' style={iconStyle} />
                </Card.Body>
            </Card>

            <Card bg='light' text='dark' className='widget-visitor-card my-2 p-0 m-2' style={{width:'100%'}}>
                <Card.Body className='text-center'>
                    <i className='fas fa-edit' style={iconStyle} />
                    <p className='h3 font-weight-bold' > {caps('labels:common.operaciones')} </p>
                    {/* <p className='h5 font-weight-bold'>{caps('labels:charts.target.trabajos_proceso')}: {dataTargets.trabajosProceso}</p> */}
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.hh_pendiente')}: {dataTargets.hhPendiente}</p>
                </Card.Body>
            </Card>

            <Card bg='light' text='dark' className='widget-visitor-card my-2 p-0 m-2' style={{width:'100%'}}>
                <Card.Body className='text-center'>
                    <p className='h3 font-weight-bold'>{caps('labels:titles.billings')}   </p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.trabajos_facturar')}: {dataTargets.trabajosFacturar}</p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.cobranzas_pendientes')}: {dataTargets.cobranzasPendientes}</p>
                    <i className='fas fa-file-invoice-dollar' style={iconStyle} />
                </Card.Body>
            </Card>

            <Card bg='light' text='dark' className='widget-visitor-card my-2 p-0 m-2' style={{width:'100%'}}>
                <Card.Body className='text-center'>
                    <p className='h3 font-weight-bold' > {caps('labels:common.buyings')}  </p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.compras_pendiente')}: {dataTargets.comprasPendientes}</p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.compras_camino')}: {dataTargets.comprasCamino}</p>
                    <i className='fas fa-truck-loading' style={iconStyle} />
                </Card.Body>
            </Card>
            
            <Card bg='light' text='dark' className='widget-visitor-card my-2 p-0 m-2' style={{width:'100%'}}>
                <Card.Body className='text-center'>
                    <p className='h3 font-weight-bold' > {caps('labels:titles.inventory')} </p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.consumos_no_cotizados')}: {dataTargets.consumosNoCotizados}</p>
                    <p className='h5 font-weight-bold'>{caps('labels:charts.target.inventario_ajustes')}: {dataTargets.ajustesInventario}</p>
                    <i className='fas fa-boxes' style={iconStyle} />
                </Card.Body>
            </Card>
        </Col>
    </>)

}