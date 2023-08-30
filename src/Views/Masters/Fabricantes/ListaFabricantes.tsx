import React, { useCallback, useState } from 'react'
import { ListaBase } from '../../Common/ListaBase';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { Fabricante, FabricanteColumns } from '../../../Data/Models/Fabricante/Fabricante';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';

const ListaFabricantes = () => {
  const { capitalize: caps } = useFullIntl();

  const [filter, setFilter] = useState<{ status: string; tipo: string }>({
    status: '-1',
    tipo: '-1'
  });

  const customFilter = useCallback((fabricante: Fabricante): boolean => {
    const isFilterByStatus: boolean = filter.status == '-1' || fabricante.status == filter.status;
    return isFilterByStatus;
  }, [filter]);

  return (<>
    <ListaBase<Fabricante>
      title='titles:manufacturers'
      source={$j('fabricantes')}
      permission='masters'
      columns={FabricanteColumns}
      customFilter={customFilter}
    >
      <ApiSelect<{ label: string, value: string }>
        name='equipo_tipo'
        label='Activo'
        source={[
          {
            label: caps('labels:common.all'),
            value: '-1'
          },
          {
            label: caps('labels:common.yes'),
            value: '1'
          },
          {
            label: caps('labels:common.no'),
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
}

export default ListaFabricantes