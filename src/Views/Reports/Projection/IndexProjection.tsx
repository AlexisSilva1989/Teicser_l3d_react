import React, { useState, useCallback, useEffect } from 'react';
import { Col, Button, Card, Tooltip } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';

import { useApi } from "../../../Common/Hooks/useApi";
import FormProjection, { IdataFormProjection } from '../../../Components/views/Home/Projection/FormProjection';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';

export const IndexProjection = () => {

	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [lastDateProjection, setLastDateProjection] = useState<string | null>('01-03-2021');
	const [maxDateProjection, setMaxDateProjection] = useState<string | undefined>();
	const api = useApi();

	const handleSubmitProjection = (data: IdataFormProjection) => {
	  	setIsSaving(true);

		const type_projection_value : {[key : string] : any} = JSON.parse(JSON.stringify(data.type_projection));
		data.type_projection = type_projection_value['value']
		api.post("service_render/projection_operational_var", data)
			.success((response) => {
				console.log(response)
			})
			.fail("base.load")
			.finally(() => setIsSaving(false));
	};

	//BUSCAR Y SETEAR LA FECHA DE LA ULTIMA PROYECCION

	return (<>
		<BaseContentView title='titles:projection_variable'>
			{ lastDateProjection === null 
				? <ShowMessageInModule message='No se ha encotrado datos de variables operacionales'/>
				: <>
					<Col sm={6} className='text-left mb-2'>
						<h4>
							Periodo a considerar para la proyección de desgaste
						</h4>		
					</Col>
					<Col sm={6} className='text-center mb-2'>
						<h5>
							Fecha de última medición {lastDateProjection}
						</h5>		
					</Col>
					<Col sm={12} className='mb-2'>
						<FormProjection
							onSubmit={handleSubmitProjection}
							isSaving={isSaving}
							textButtonSubmit={"Simular proyección"}
							lastDateProjection = {lastDateProjection}
							maxDateProjection = {maxDateProjection}
						/>
					</Col>
				</>
			}
		</BaseContentView>		
	</>);
};
