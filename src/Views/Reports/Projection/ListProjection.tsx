import React, { useState } from 'react';
import { ListaBase } from '../../Common/ListaBase';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { Projection, ProjectionsColumns } from '../../../Data/Models/Gemelo/Projection';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { Equipo } from '../../../Data/Models/Equipo/Equipo';
import { IComponente } from '../../../Data/Models/Componentes/Componentes';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';

export const ListProjection = () => {
	//interfaces
	interface IDataFilters {
		filterByStatus: string | undefined
		filterByEquipo: string | undefined
		filterByPeriodo: string | undefined
		filterByComponente: string | undefined

	}

	//hooks
	const { addToast } = useToasts();
	const { capitalize: caps } = useFullIntl();

	//states
	const [filtersParams, setFiltersParams] = useState<IDataFilters>({
		filterByStatus: undefined,
		filterByEquipo: undefined,
		filterByPeriodo: undefined,
		filterByComponente: undefined
	});
	const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([]);
	const [loadingData, setLoadingData] = useState(false);

	//handles
	const updateComponentes = async (equipoId: string) => {
		setLoadingData(true);

		await ax.get<IComponente[]>('service_render/componentes/componentes_with_data',
			{ params: { equipo_id: equipoId, typeData: 'PROJECTED' } })
			.then((response) => {
				setComponentsForTraining(response.data);
			})
			.catch((e: AxiosError) => {
				if (e.response) {
					addToast(caps('errors:base.load', { element: "componentes" }), {
						appearance: 'error',
						autoDismiss: true,
					});
				}
			}).finally(() => {
				setLoadingData(false);
			});
		setFiltersParams(state => $u(state, { filterByComponente: { $set: undefined } }))
	}

	return <ListaBase<Projection>
		title='titles:wear_projections'
		source={$j('service_render', 'list_projections')}
		permission='gemelo_digital'
		columns={ProjectionsColumns}
		labelBotton="nueva proyección"
		paginationServe={true}
		paramsFilter={filtersParams}
		onSelect={"details"}
	>
		<ApiSelect<Equipo>
			name='equipo_select'
			placeholder='Seleccione Equipo'
			source={'service_render/equipos'}
			label={'Equipo'}
			value={filtersParams.filterByEquipo == undefined ? '-1' : filtersParams.filterByEquipo}
			firtsOptions={{ label: 'TODOS', value: '-1' }}
			selector={(option) => {
				return { label: option.nombre, value: option.id.toString() };
			}}
			onChange={(data) => {
				updateComponentes(data);
				setFiltersParams(state => $u(state, { filterByEquipo: { $set: data != '-1' ? data : undefined } }))
			}}
		/>
		<ApiSelect<IComponente>
			name='componente'
			label={'componente'}
			placeholder='Seleccione'
			source={componentsForTraining}
			value={filtersParams.filterByComponente == undefined ? '-1' : filtersParams.filterByComponente}
			selector={(option: IComponente) => {
				return { label: option.nombre, value: option.id.toString() };
			}}
			onChange={(data) => {
				setFiltersParams(state => $u(state, { filterByComponente: { $set: data != '-1' ? data : undefined } }))
			}}
			firtsOptions={{ label: 'TODOS', value: '-1' }}
			isLoading={loadingData}
			isDisabled={loadingData}
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
				return { label: option.label, value: option.value };
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
				return { label: option.label, value: option.value };
			}}
			onChange={(data) => {
				setFiltersParams(state => $u(state, { filterByStatus: { $set: data != '-1' ? data : undefined } }))
			}}
		/>


	</ListaBase>
};