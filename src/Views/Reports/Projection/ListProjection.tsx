import React from 'react';
import { ListaBase } from '../../Common/ListaBase';
import { $j } from '../../../Common/Utils/Reimports';
import { Projection, ProjectionsColumns } from '../../../Data/Models/Gemelo/Projection';

export const ListProjection = () => {

	return <ListaBase<Projection> 
		title='titles:wear_projections' 
		source={$j('service_render','extend','list_projections')} 
		permission='gemelo_digital' 
		columns={ProjectionsColumns} 
		labelBotton="nueva proyección"
	/>;
};