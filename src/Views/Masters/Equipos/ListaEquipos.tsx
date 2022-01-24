import React, { useState, useCallback } from 'react';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { ListaBase } from '../../Common/ListaBase';
import { EquipoColumns, EquipoTipo, tiposEquipos, tiposEquiposWithAll } from '../../../Data/Models/Equipo/Equipo';

export const ListaEquipos = () => {

	const [filter, setFilter] = useState<{ status: string; tipo: string }>({
		status: '-1',
		tipo: '-1'
	});

	const customFilter = useCallback((equipo: EquipoTipo): boolean => {
		const isFilterByStatus : boolean = filter.status == '-1' || equipo.status.toString() == filter.status;
		const isFilterByTipo : boolean = filter.tipo == '-1' || equipo.tipo == filter.tipo;

		return isFilterByStatus && isFilterByTipo;
	}, [filter]);


	return (<>
		<ListaBase<EquipoTipo>
			title='titles:equipment'
			source={$j('service_render/equipos')}
			permission='masters'
			columns={EquipoColumns}
			queryParams={{ showStatus: true }}
			customFilter={customFilter}
		>
			<CustomSelect
				label='Tipo'
				preSelect={filter.tipo}
				onChange={(e) => {
					const val = e.value;
					setFilter((s) => $u(s, { tipo: { $set: val } }));
				}}
				options={tiposEquiposWithAll}
			/>

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


