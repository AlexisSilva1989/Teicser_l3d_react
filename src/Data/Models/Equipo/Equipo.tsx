import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";

export const tiposEquipos = [
	{
		label: 'SAG',
		value: 'SAG'
	},
	{
		label: 'BOLAS',
		value: 'BOLAS'
	}
];

export const tiposEquiposWithAll : {value: string; label: string;}[] = [{
	label: 'labels:all',
	value: '-1'
}].concat(tiposEquipos);

export interface Equipo {
	id: string
	nombre: string
	status: string
}

export interface EquipoTipo extends Equipo {
	equipo_tipo: {
		id: string 
		nombre_corto: string
	}
}


export interface IDataFormEquipo {
	id?: string
	name: string 
	tipo_equipo: string
	file_scaler?: any 
	file_model?: any 
	status?: string
	perfil_nominal?: object[] 
	perfil_critico?: object[]  
	file_checkpoint?: any 
	server_selected?: string[]
	components_selected?: string[]
  }

export const EquipoColumns: (intl: IntlShape) => IDataTableColumn<EquipoTipo>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{
			selector: 'id',
			name: header('columns:id'),
			format: (equipo) => equipo.id.toString().padStart(6, '0')
		},
		{
			selector: 'nombre',
			name: header('columns:name'),
			format: (equipo) => equipo.nombre
		},
		{
			selector: 'tipo',
			name: header('columns:type'),
			format: (equipo) => equipo.equipo_tipo.nombre_corto
		},
		{
			selector: 'activo',
			name: header('columns:active'),
			format: (equipo) => header(equipo.status ? 'labels:yes' : 'labels:no')
		}
	];
};