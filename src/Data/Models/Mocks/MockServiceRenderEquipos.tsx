import React, { useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockData = [
	{
		'id': 13,
		'nombre': 'CMDIC_141ML1011',
		'tipo_id': 1,
		'linea_trabajo': 3,
		'equipo_tipo': {
			'id': 1,
			'nombre_corto': 'SAG'
		}
	},
	{
		'id': 9,
		'nombre': 'CMDIC_140ML001',
		'tipo_id': 1,
		'linea_trabajo': 1,
		'equipo_tipo': {
			'id': 1,
			'nombre_corto': 'SAG'
		}
	},
	{
		'id': 10,
		'nombre': 'CMDIC_140ML002',
		'tipo_id': 1,
		'linea_trabajo': 2,
		'equipo_tipo': {
			'id': 1,
			'nombre_corto': 'SAG'
		}
	},
	{
		'id': 11,
		'nombre': 'CMDIC_140ML003',
		'tipo_id': 2,
		'linea_trabajo': 1,
		'equipo_tipo': {
			'id': 2,
			'nombre_corto': 'MOBO'
		}
	},
	{
		'id': 12,
		'nombre': 'CMDIC_140ML004',
		'tipo_id': 2,
		'linea_trabajo': 2,
		'equipo_tipo': {
			'id': 2,
			'nombre_corto': 'MOBO'
		}
	},
	{
		'id': 14,
		'nombre': 'CMDIC_141ML1012',
		'tipo_id': 2,
		'linea_trabajo': 3,
		'equipo_tipo': {
			'id': 2,
			'nombre_corto': 'MOBO'
		}
	},
	{
		'id': 15,
		'nombre': 'CMDIC_141ML1013',
		'tipo_id': 2,
		'linea_trabajo': 3,
		'equipo_tipo': {
			'id': 2,
			'nombre_corto': 'MOBO'
		}
	},
	{
		'id': 16,
		'nombre': 'CMDIC_144ML1022',
		'tipo_id': 2,
		'linea_trabajo': null,
		'equipo_tipo': {
			'id': 2,
			'nombre_corto': 'MOBO'
		}
	}
];

interface MockServiceRenderEquiposProps {
  children: ReactNode
}

const MockServiceRenderEquipos: React.FC<MockServiceRenderEquiposProps> = ({ children }) => {
	useEffect(() => {
		const mock = new MockAdapter(axios, { delayResponse: 500 });

		mock.onGet('/api/service_render/equipos').reply(200, mockData);

		return () => {
			mock.restore();
		};
	}, []);

	return <>{children}</>;
};

MockServiceRenderEquipos.propTypes = {
	children: PropTypes.node.isRequired,
};

export default MockServiceRenderEquipos;
