import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { useCommonRoutes } from '../../../Common/Hooks/useCommonRoutes';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { $j } from '../../../Common/Utils/Reimports';
import { Buttons } from '../../../Components/Common/Buttons';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { BaseContentView } from '../../Common/BaseContentView';

const ShowProjection = () => {
    const { stateAs } = useNavigation();
    const dataStateAs = stateAs<{ data: {id:number}}>();
    const { pushAbsolute } = useFullLocation();
    const {data_select} = useParams<{data_select: string}>();
    
    const [dataId , setDataId] = useState<string>();
    
    useEffect(()=>{
        console.log('data_select: ', data_select);
        if(dataStateAs === undefined && data_select === undefined){ 
            pushAbsolute("routes:base.projection") 
            return
        }

        data_select !== undefined 
            ? setDataId(data_select)
            : setDataId(dataStateAs.data.id.toString())
    },[])

    return (<>
		<BaseContentView title={"Simulación de desgaste"}>
            <Col className="col-12 mb-4">
				<Buttons.GoTo path={"routes:base.projection"} />
			</Col>
            <Col>
                {dataId && <SimulacionGrafica
                    resourceData={$j('service_render/extend/projection',dataId)}
                />}
            </Col>
		</BaseContentView>
	</>);
}

export default ShowProjection;