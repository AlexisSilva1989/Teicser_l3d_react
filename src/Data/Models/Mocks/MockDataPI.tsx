import React, { useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Los datos del archivo adjunto (simplificado para el ejemplo)
const mockDataPI = [
	{
		'TIMESTAMP': '1969-12-31',
		'EQUIPO': 'CMDIC_141ML1011',
		'TON_ALIM': 5286.87,
		'TRAT_MOLINO': 127676.98,
		'ENERGIA': 3.96,
		'POTENCIA': 20873.49,
		'VEL_RPM': 9.02,
		'ESTADO': 'FUNCIONANDO',
		'SENTIDO': 'DIRECTO',
		'PRES_DESC_1': 1440.66,
		'PRES_DESC_2': null,
		'AGUA_PROC': 1586.03,
		'SOLIDOS': 76.91,
		'PEBBLES': 11990.12,
		'PAS125': 17.72,
		'PAS200': 44.91,
		'PAS400': 81.55,
		'BOLAS_TON': 5.91,
		'DWI': 5.53,
		'BWI': 12.14,
		'PH': 7.05,
		'AI': 0.22,
		'CUT': 1.17,
		'MO': 356.83,
		'FET': 2.82,
		'AS': 60.16,
		'VEL_SENTIDO': null,
		'TON_ACUM_CAMP': null,
		'DIAS_ACUM_CAMP': null
	}
	// Añade el resto de los datos del archivo adjunto aquí
];

interface MockDataPIProps {
  children: ReactNode
}

const MockDataPI: React.FC<MockDataPIProps> = ({ children }) => {
	useEffect(() => {
		const mock = new MockAdapter(axios, { delayResponse: 500 });

		// Intercept all requests to the specific endpoint and reply with the mock data
		mock.onGet(new RegExp('/api/service_render/data_pi')).reply((config) => {
			// Extraemos los parámetros de la solicitud para usarlos si es necesario
			const params = new URLSearchParams(config.params);
			const equipoId = params.get('equipoId');
			const componenteId = params.get('componenteId');
      
			// Podemos filtrar los datos aquí si fuera necesario, por ahora devolvemos todo
			const filteredData = mockDataPI; // Aquí puedes agregar lógica para filtrar los datos según equipoId y componenteId

			return [200, { data: filteredData }];
		});

		return () => {
			mock.restore();
		};
	}, []);

	return <>{children}</>;
};

MockDataPI.propTypes = {
	children: PropTypes.node.isRequired,
};

export default MockDataPI;
