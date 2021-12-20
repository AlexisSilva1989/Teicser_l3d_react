import React from 'react';
import { Col } from 'react-bootstrap';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { $j } from '../../../Common/Utils/Reimports';
import { Buttons } from '../../../Components/Common/Buttons';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { BaseContentView } from '../../Common/BaseContentView';

const ShowProjection = () => {
    const { stateAs } = useNavigation();
    const { data } = stateAs<{ data: {id:number}}>();
    return (<>
		<BaseContentView title={"Simulación de desgaste"}>
            <Col className="col-12 mb-4">
				<Buttons.Back />
			</Col>
            <Col>
                <SimulacionGrafica
                    resourceData={$j('service_render/extend/projection',data.id.toString())}
                />
            </Col>
		</BaseContentView>
	</>);
}

export default ShowProjection;