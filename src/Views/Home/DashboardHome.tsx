import React from 'react';
import { BaseContentView } from '../Common/BaseContentView';


const initialDataTargets = {
    cotAbiertas: 0,
    cotPendienteAprobacion: 0,
    trabajosProceso: 0,
    hhPendiente: 0,
    trabajosFacturar: 0,
    cobranzasPendientes: 0,
    comprasPendientes: 0,
    comprasCamino: 0,
    consumosNoCotizados: 0,
    ajustesInventario: 0
}

export const DashboardHome = () => {

    return <BaseContentView>
        {/* {isLoad 
            ? (<BounceLoader css={{ margin: "2.5rem auto" } as any} color="var(--primary)" size={64} />)
            : (<>
                <DasboardHomeTargets dataTargets={dataTargets} />
                <DasboardHomeGraphs dataCharts={dataGraphs} />
            </>)
        } */}
    </BaseContentView>;
}