import React, { useState, useCallback } from 'react';
import { $j, $u } from '../../Common/Utils/Reimports';
import { Usuario, UsuarioColumns } from '../../Data/Models/Configuracion/Usuario';
import { CustomSelect } from '../../Components/Forms/CustomSelect';
import { Col, Button } from 'react-bootstrap';
import { BaseContentView } from '../Common/BaseContentView';
import { ApiTable } from '../../Components/Api/ApiTable';
import { useLocalization } from '../../Common/Hooks/useLocalization';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useNavigation } from '../../Common/Hooks/useNavigation';
import { SearchBar } from '../../Components/Forms/SearchBar';
import { useSearch } from '../../Common/Hooks/useSearch';
import { useCommonRoutes } from "../../Common/Hooks/useCommonRoutes";
import { ListaBase } from '../Common/ListaBase';

export const ListaUsuarios = () => {
	// const [search, doSearch] = useSearch();
	// const { meta } = useLocalization();
	// const { intl } = useFullIntl();
	// const { goto } = useNavigation();
	// const { gotoModify } = useCommonRoutes();

	const [filter, setFilter] = useState<{ tipo: string; usuario?: Usuario }>({
		tipo: '1'
	});

	const customFilter = useCallback((x: Usuario): boolean => {
		if (filter.tipo === '-1') {
			return true;
		}

		if (x.activo === true && filter.tipo === '1') {
			return true;
		}

		return x.activo === false && filter.tipo === '0';

	}, [filter]);


	return (
		<>
			<ListaBase<Usuario>
				title='titles:users'
				source={$j('usuarios')}
				permission='configuration'
				columns={UsuarioColumns}
				customFilter={customFilter}
			>
				<Col>
					<br className='mb-2' />

					<CustomSelect
						preSelect={filter.tipo}
						onChange={(e) => {
							const val = e.value;
							setFilter((s) => $u(s, { tipo: { $set: val } }));
						}}
						options={[{
							label: 'labels:all',
							value: '-1'
						},
						{
							label: 'labels:active',
							value: '1'
						},
						{
							label: 'labels:inactive',
							value: '0'
						}]}
					/>
				</Col>
			</ListaBase>
		</>
	);
};


