import { IntlShape } from 'react-intl';
import { IDataTableColumn } from 'react-data-table-component';
import { Utils } from '../../../Common/Utils/Utils';

export interface Simulation {
	id: string | number
	nombre_equipo: string
	nombre_componente: string
	fecha_medicion: string
	fecha_simulacion: string
	fecha_end_xample: string
	estado: string
}

export const SimulationsColumns: (intl: IntlShape) => IDataTableColumn<Simulation>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{ selector: 'id', name: header('columns:id'), width: '10%' },
		{ selector: 'nombre_equipo', name: header('columns:equipo'), width: '20%' },
		{ selector: 'nombre_componente', name: 'Componente' , width: '19%'},
		{ selector: 'fecha_medicion', name: header('columns:fecha_medicion') , width: '13%' },
		{ selector: 'fecha_end_xample', name: 'Fecha a proyectar' , width: '13%'},
		{ selector: 'fecha_simulacion', name: header('columns:fecha_simulacion'), width: '15%' },
		{ selector: 'estado', name: header('columns:estado'), width: '10%'}
	];
};