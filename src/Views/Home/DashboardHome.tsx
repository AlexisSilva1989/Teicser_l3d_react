import React, { useEffect, useState } from 'react';
import { BaseContentView } from '../Common/BaseContentView';
import { Card, Col, Row } from 'react-bootstrap';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useHistory } from 'react-router-dom';
import { $j } from '../../Common/Utils/Reimports';
import SAGMILL from "../../Assets/images/mills/sag-mill.png";
import BALLMILL from "../../Assets/images/mills/ball-mill.png";
import { ax } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { useToasts } from 'react-toast-notifications';
import { LoadingSpinner } from '../../Components/Common/LoadingSpinner';
import { EquiposPorTipo } from '../../Data/Models/Equipo/Equipo';


export const DashboardHome = () => {
    const { addToast } = useToasts();
    const { localize, capitalize: caps } = useFullIntl();
    const history = useHistory();

    const [equiptmentsByType, setEquiptmentsByType] = useState<EquiposPorTipo[]>()
    const [loadingData, setLoadingData] = useState(false)

    const SAGEquipments = equiptmentsByType?.find((type: any) => type.nombre_corto === "SAG")?.equipos ?? [];
    const BALLEquipments = equiptmentsByType?.find((type: any) => type.nombre_corto === "MOBO")?.equipos ?? [];

    const handleMillCardClick = (id: number) => {
        history.push($j(localize('routes:base.projections')), { data: { id: id } })
    }

    useEffect(() => {
        async function fetch() {
            setLoadingData(true)
            await ax.get($j('equipos/dashboard'))
                .then(response => {
                    setEquiptmentsByType(response.data)
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        addToast(
                            caps('errors:base.load', { element: 'proyeciones de equipo' }),
                            { appearance: 'error', autoDismiss: true }
                        );
                    }
                }).finally(() => { setLoadingData(false) });
        }
        fetch()
    }, [])

    return loadingData ? <LoadingSpinner /> : <BaseContentView asDiv={true}>
      <div className='h-100 d-flex flex-column justify-content-center'>
        <Row className={`w-100 m-0 d-flex flex-nowrap ${SAGEquipments.length > 3 && "overflow-x-scroll"}`}>
            {
                SAGEquipments.map(({ nombre: title, id }, index) => (
                    <Col sm="12" md="4" className="">
                        <Card onClick={() => handleMillCardClick(id)} key={index} className='mill-card px-2 py-4 text-center d-flex flex-column align-items-center'>
                            <Card.Title className='text-uppercase font-weight-bold h1'>
                                {title}
                            </Card.Title>
                            <Card.Img src={SAGMILL} variant="bottom" style={{ "maxWidth": "184px" }} />
                        </Card>
                    </Col>
                ))

            }
        </Row>
        <Row className={`w-100 m-0 d-flex flex-nowrap ${BALLEquipments.length > 4 && "overflow-x-scroll"}`}>
            {
                BALLEquipments.map(({ nombre: title, id }, index) => (
                    <Col sm="12" md="3" className="">
                        <Card onClick={() => handleMillCardClick(id)} key={index} className='mill-card px-2 py-4 text-center d-flex flex-column align-items-center'>
                            <Card.Title className='text-center text-uppercase font-weight-bold h1'>
                                {title}
                            </Card.Title>
                            <Card.Img src={BALLMILL} variant="bottom" style={{ "maxWidth": "184px" }} />
                        </Card>
                    </Col>
                ))
            }
        </Row>
      </div>
    </BaseContentView >;
};
