import { IntlShape } from 'react-intl';
import { IDataTableColumn } from 'react-data-table-component';
import { Utils } from '../../../Common/Utils/Utils';

export interface Simulation {
	id: string | number
	nombre_equipo: string
	nombre_componente: string
	fecha_medicion: string
	fecha_simulacion: string
	estado: string
}

export const SimulationsColumns: (intl: IntlShape) => IDataTableColumn<Simulation>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{ selector: 'id', name: header('columns:id') },
		{ selector: 'nombre_equipo', name: header('columns:equipo') },
		{ selector: 'nombre_componente', name: 'Componente' },
		{ selector: 'fecha_medicion', name: header('columns:fecha_medicion') , center: true},
		{ selector: 'fecha_simulacion', name: header('columns:fecha_simulacion'), center: true },
		{ selector: 'estado', name: header('columns:estado') }
	];
};