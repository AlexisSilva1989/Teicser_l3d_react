import { ListaBase } from '../Common/ListaBase';
import React, { useState, useCallback } from 'react';
import { $j, $u } from '../../Common/Utils/Reimports';
import { Usuario, UsuarioColumns } from '../../Data/Models/Configuracion/Usuario';
import { CustomSelect } from '../../Components/Forms/CustomSelect';
import { Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BaseContentView } from '../Common/BaseContentView';
import { BounceLoader } from 'react-spinners';
import { ApiTable } from '../../Components/Api/ApiTable';
import { useLocalization } from '../../Common/Hooks/useLocalization';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useNavigation } from '../../Common/Hooks/useNavigation';
import { SearchBar } from '../../Components/Forms/SearchBar';
import { useSearch } from '../../Common/Hooks/useSearch';
import { useCommonRoutes } from "../../Common/Hooks/useCommonRoutes";

export const ListaUsuarios = () => {
	const [search, doSearch] = useSearch();
	const { meta , column, label} = useLocalization();
	const { intl, capitalize: caps, localize } = useFullIntl();
	const { goto } = useNavigation();
	const { gotoModify, gotoDetails } = useCommonRoutes();

	const [filter, setFilter] = useState<{ tipo: string; usuario?: Usuario }>({
		tipo: '1'
	});

	const customFilter = useCallback( (x: Usuario): boolean => {
		if (filter.tipo === '-1') {
			return true;
		}

		if (x.activo === true && filter.tipo === '1') {
			return true;
		}

		return x.activo === false && filter.tipo === '0';

	},[filter]);

	return <BaseContentView title='titles:quotation_details'>
		<Col sm={2}>
			<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={() => goto.relative('meta.add')}>
				<i className='fas fa-plus mr-3' />
				{meta('add')}
			</Button>
		</Col>
		<Col sm={2} className='text-left offset-4 mb-2'>
		 	<CustomSelect
				preSelect={filter.tipo}
				label="status"
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
		<Col sm={3} className="offset-1">
			<SearchBar onChange={doSearch} />
		</Col>
		<Col sm={12}>
			<ApiTable<Usuario> 
				source={$j('usuarios')} 
				columns={UsuarioColumns(intl)} 
				customFilter={customFilter}
				search={search}
				onSelect={e => gotoModify({ data: e })}
			/>
		</Col>
	</BaseContentView>;
};


