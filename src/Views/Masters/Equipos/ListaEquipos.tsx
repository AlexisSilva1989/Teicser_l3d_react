import React, { useState, useCallback } from 'react';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { ListaBase } from '../../Common/ListaBase';
import { EquipoColumns, EquipoTipo, tiposEquipos, tiposEquiposWithAll } from '../../../Data/Models/Equipo/Equipo';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';

export const ListaEquipos = () => {
	const { capitalize: caps } = useFullIntl();

	const [filter, setFilter] = useState<{ status: string; tipo: string }>({
		status: '-1',
		tipo: '-1'
	});

	const customFilter = useCallback((equipo: EquipoTipo): boolean => {
		const isFilterByStatus: boolean = filter.status == '-1' || equipo.status.toString() == filter.status;
		const isFilterByTipo: boolean = filter.tipo == '-1' || equipo.equipo_tipo.id == filter.tipo;
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
			<ApiSelect<{ id: string, nombre_corto: string }>
				name='equipo_status'
				label='Tipo'
				source={'service_render/equipos/tipos'}
				value={filter.tipo}
				firtsOptions={{ value: '-1', label: caps('labels:all') }}
				selector={(option) => {
					return { label: option.nombre_corto, value: option.id };
				}}
				onChange={(data) => {
					console.log('data: ', data);
					
					setFilter((s) => $u(s, { tipo: { $set: data } }));
				}}
			/>

			<ApiSelect<{ label: string, value: string }>
				name='equipo_tipo'
				label='Activo'
				source={[
					{
						label: caps('labels:all'),
						value: '-1'
					},
					{
						label: caps('labels:yes'),
						value: '1'
					},
					{
						label: caps('labels:no'),
						value: '0'
					}
				]}
				value={filter.status}
				selector={(option) => {
					return { label: option.label, value: option.value };
				}}
				onChange={(data) => {
					setFilter((s) => $u(s, { status: { $set: data } }));
				}}
			/>
		</ListaBase>
	</>);
};


