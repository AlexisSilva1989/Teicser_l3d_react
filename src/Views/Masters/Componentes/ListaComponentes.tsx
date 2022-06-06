import React, { useState, useCallback } from 'react';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { ListaBase } from '../../Common/ListaBase';
import { ComponenetesColumns, IComponente } from '../../../Data/Models/Componentes/Componentes';

export const ListaComponentes = () => {

	const [filter, setFilter] = useState<{ status: string; }>({ status: '-1' });

	const customFilter = useCallback((server: IComponente): boolean => {
		return filter.status == '-1' || server.status.toString() == filter.status;
	}, [filter]);


	return (<>
		<ListaBase<IComponente>
			title='componentes'
			source={$j('service_render/componentes')}
			permission='masters'
			columns={ComponenetesColumns}
			customFilter={customFilter}
		>
			<CustomSelect
				label='Activo'
				preSelect={filter.status}
				onChange={(e) => {
					const val = e.value;
					setFilter((s) => $u(s, { status: { $set: val } }));
				}}
				options={[
					{
						label: 'labels:all',
						value: '-1'
					},
					{
						label: 'labels:yes',
						value: '1'
					},
					{
						label: 'labels:no',
						value: '0'
					}
				]}
			/> 
		</ListaBase>
	</>);
};


