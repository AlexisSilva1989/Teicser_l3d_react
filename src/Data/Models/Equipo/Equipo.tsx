import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";
import { OptionType } from "../../../Components/Forms/CustomSelect";

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
	tipo: string
}


export interface IDataFormEquipo {
	id?: string
	name: string 
	tipo_equipo: {label: string, value: string} 
	file_scaler?: any 
	file_model?: any 
	status?: string
	perfil_nominal?: object[] 
	perfil_critico?: object[]  
  }

export const EquipoColumns: (intl: IntlShape) => IDataTableColumn<EquipoTipo>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{
			selector: 'id',
			name: header('columns:id'),
			format: (equipo) => equipo.id
		},
		{
			selector: 'nombre',
			name: header('columns:name'),
			format: (equipo) => equipo.nombre
		},
		{
			selector: 'tipo',
			name: header('columns:type'),
			format: (equipo) => equipo.tipo
		},
		{
			selector: 'activo',
			name: header('columns:active'),
			format: (equipo) => header(equipo.status ? 'labels:yes' : 'labels:no')
		}
	];
};