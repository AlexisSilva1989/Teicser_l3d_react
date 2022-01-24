import React, { useState } from 'react';
import { ListaBase } from '../../Common/ListaBase';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { Projection, ProjectionsColumns } from '../../../Data/Models/Gemelo/Projection';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { Equipo } from '../../../Data/Models/Equipo/Equipo';

export const ListProjection = () => {
	interface IDataFilters {
		filterByStatus: string | undefined
		filterByEquipo: string | undefined
		filterByPeriodo: string | undefined

	}
	const [filtersParams, setFiltersParams] = useState<IDataFilters>({
		filterByStatus: undefined,
		filterByEquipo: undefined,
		filterByPeriodo: undefined
	});

	return <ListaBase<Projection>
		title='titles:wear_projections'
		source={$j('service_render', 'extend', 'list_projections')}
		permission='gemelo_digital'
		columns={ProjectionsColumns}
		labelBotton="nueva proyección"
		paginationServe={true}
		paramsFilter={filtersParams}
	>
		<ApiSelect<Equipo>
			name='equipo_select'
			placeholder='Seleccione Equipo'
			source={'service_render/equipos'}
			label={'Equipo'}
			value={filtersParams.filterByEquipo == undefined ? '-1' : filtersParams.filterByEquipo}
			firtsOptions={{ label: 'TODOS', value: '-1' }}
			selector={(option) => {
				return { display: option.nombre, value: option.id.toString() };
			}}
			onChange={(data) => {
				setFiltersParams(state => $u(state, { filterByEquipo: { $set: data != '-1' ? data : undefined } }))
			}}
		/>
		<ApiSelect
			name='periodo_select'
			label='columns:periodo_proyeccion'
			value={filtersParams.filterByPeriodo == undefined ? '-1' : filtersParams.filterByPeriodo}
			source={[
				{ label: "TODOS", value: "-1" },
				{ label: "CAMPAÑA COMPLETA", value: "projectionComplete" },
				{ label: "ÚLTIMOS 30 DÍAS", value: "projection30Days" },
			]}
			selector={(option) => {
				return { display: option.label, value: option.value };
			}}
			onChange={(data) => {
				setFiltersParams(state => $u(state, { filterByPeriodo: { $set: data != '-1' ? data : undefined } }))
			}}
		/>
		<ApiSelect
			name='status_select'
			label='labels:common.status'
			value={filtersParams.filterByStatus == undefined ? '-1' : filtersParams.filterByStatus}
			source={[
				{ label: "TODOS", value: "-1" },
				{ label: "FINALIZADA", value: "FINALIZADA" },
				{ label: "PENDIENTE", value: "PENDIENTE" },
				{ label: "ERROR", value: "ERROR" },
			]}
			selector={(option) => {
				return { display: option.label, value: option.value };
			}}
			onChange={(data) => {
				setFiltersParams(state => $u(state, { filterByStatus: { $set: data != '-1' ? data : undefined } }))
			}}
		/>


	</ListaBase>
};