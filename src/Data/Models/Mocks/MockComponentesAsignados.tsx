import React, { useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockComponentesAsignados = [
	{
		'id': 2,
		'nombre': 'TA_COR_EXTERIOR'
	},
	{
		'id': 3,
		'nombre': 'TA_COR_INTERMEDIA'
	},
	{
		'id': 4,
		'nombre': 'TA_COR_INTERIOR'
	},
	{
		'id': 6,
		'nombre': 'CILINDRO  ALIMENTACION'
	},
	{
		'id': 7,
		'nombre': 'CILINDRO CENTRAL'
	},
	{
		'id': 8,
		'nombre': 'CILINDRO DESCARGA'
	},
	{
		'id': 9,
		'nombre': 'TD_PARRILLA'
	},
	{
		'id': 11,
		'nombre': 'TD_COR_INTERMEDIA'
	},
	{
		'id': 12,
		'nombre': 'TD_COR_INTERIOR'
	}
];

interface MockComponentesAsignadosProps {
  children: ReactNode
}

const MockComponentesAsignados: React.FC<MockComponentesAsignadosProps> = ({ children }) => {
	useEffect(() => {
		const mock = new MockAdapter(axios, { delayResponse: 500 });

		// Intercept all requests to the specific endpoint and reply with the mock data
		mock.onGet(new RegExp('/api/service_render/equipos/componentes_asignados')).reply((config) => {
			// Extract the equipo_id from the request params
			const params = new URLSearchParams(config.params);
			const equipoId = params.get('equipo_id');

			// You can customize the response based on the equipoId if needed
			// For simplicity, we return the same mock data for any equipoId
			return [200, mockComponentesAsignados];
		});

		return () => {
			mock.restore();
		};
	}, []);

	return <>{children}</>;
};

MockComponentesAsignados.propTypes = {
	children: PropTypes.node.isRequired,
};

export default MockComponentesAsignados;
