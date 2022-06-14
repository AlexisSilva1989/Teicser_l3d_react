import React from 'react'
import { IDataTableColumn } from "react-data-table-component"
import { IntlShape } from "react-intl"
import { Utils } from "../../../Common/Utils/Utils"

export interface IEntrenamiento {
	id: string
	equipo: string
	componente: string
	model_name: string
	scaler_name: string
	initial_vars: string
	segments_generate: string
	perfil_critico_exist?: number
	perfil_nominal_exist?: number
}

export interface IDataFormEntrenamiento {
	id: string
	equipo: string
	componente: string
	model_file?: any
	scaler_file?: any
	nominal_file?: object[]
	critical_file?: object[]
	initial_vars: string
	segments_generate: string
}

export const EntrenamientoColumns: (intl: IntlShape) => IDataTableColumn<IEntrenamiento>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{
			selector: 'equipo',
			name: 'Equipo',
		},
		{
			selector: 'componente',
			name: 'Componente',
		},
		{
			selector: 'model_name',
			name: 'Archivo modelo',
		},
		{
			selector: 'scaler_name',
			name: 'Archivo scaler',
		},
    {
			selector: 'segments_generate',
			name: 'Segmentos',
      cell: entrenamiento => entrenamiento.segments_generate 
      ? <i className='text-success fa fa-check' />
      : <i className='text-danger fa fa-times' />,
			center: true
		},
		{
			selector: 'perfil_nominal_exist',
			name: 'Perfil nominal',
      cell: entrenamiento => (entrenamiento?.perfil_nominal_exist && entrenamiento?.perfil_nominal_exist > 0)
        ? <i className='text-success fa fa-check' />
        : <i className='text-danger fa fa-times' />,
			center: true
		},
		{
			selector: 'perfil_critico_exist',
			name: 'Perfil crítico',
      cell: entrenamiento => (entrenamiento?.perfil_critico_exist && entrenamiento?.perfil_critico_exist > 0)
        ? <i className='text-success fa fa-check' />
        : <i className='text-danger fa fa-times' />,
			center: true
		},

	];
};