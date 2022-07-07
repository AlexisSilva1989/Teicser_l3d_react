import React, { useState } from 'react'
import { $u } from '../../../Common/Utils/Reimports';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipmentWithComponents, EquipmentWithComponentsColumns } from '../../../Data/Models/Equipo/Equipo'
import { ListaBase } from '../../Common/ListaBase'

interface IDataFilters {
  filterByTipo: string | undefined
}

function ListSimulationSummary() {
  //states
	const [filtersParams, setFiltersParams] = useState<IDataFilters>({
		filterByTipo: undefined
	});

  return (

    <ListaBase<EquipmentWithComponents>
      title='Resumen de proyección por equipo'
      source='service_render/last_projections_equipment'
      permission='reports'
      columns={EquipmentWithComponentsColumns}
      queryParams={{ showStatus: true }}
		  paramsFilter={filtersParams}
      onSelect={"details"}
      paginationServe={true}
      selectableCriteria={e => e.componentes.length > 0}

    >
      <ApiSelect<{id: number, nombre_corto: string}>
        name='tipo_equipo'
        source={'service_render/equipos/tipos'}
        label={'Tipo'}
        value={filtersParams.filterByTipo == undefined ? '-1' : filtersParams.filterByTipo}
        firtsOptions={{ label: 'TODOS', value: '-1' }}
        selector={(option) => {
          return { label: option.nombre_corto, value: option.id.toString() };
        }}
        onChange={(data) => {
          setFiltersParams(state => $u(state, { filterByTipo: { $set: data != '-1' ? data : undefined } }))
        }}
        
      />
    </ListaBase>
  )
}

export default ListSimulationSummary