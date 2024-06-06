import React from 'react';
import { $j } from '../../../Common/Utils/Reimports';
import { ListaBase } from '../../Common/ListaBase';
import { EntrenamientoColumns, IEntrenamiento } from '../../../Data/Models/Entrenamiento/Entrenamiento';

export const ListaEntrenamiento = () => {

	return (<>
		<ListaBase<IEntrenamiento>
			title='Entrenamiento'
			source={$j('service_render/entrenamiento')}
			permission='masters'
			columns={EntrenamientoColumns}
		/>
	</>);
};


