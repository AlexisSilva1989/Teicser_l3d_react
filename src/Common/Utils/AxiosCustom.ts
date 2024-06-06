import axios, { AxiosError } from 'axios';
import { apiUrl } from '../../Config/Api';
import { AppStore } from '../../Store/AppStore';
import { logout } from '../../Store/Dashboard/DashboardActionCreators';

import swal from 'sweetalert';

axios.defaults.withCredentials = false;

export const ax = axios.create({ baseURL: apiUrl });

export const axf = axios.create({ baseURL: apiUrl });



ax.interceptors.request.use((request) => {
	const token = localStorage.getItem('api-token');

	if (token) {
		request.headers['Authorization'] = `Bearer ${token}`;
		request.headers['Access-Control-Max-Age'] = 600;
	}
	return request;
});

ax.interceptors.response.use(
	(response) => {
		return response;
	},
	async (e: AxiosError) => {
		if (e.response != null) {
			if (e.response.status! === 401) {
				await axf.get('auth/logout').catch(() => null);
				AppStore.dispatch(logout());
				localStorage.removeItem('api-token');
				//alert('Unauthorized, the session has been closed');
				swal("Unauthorized!", "the session has been closed!", "error");
			}
			return Promise.reject(e);
		}
	}
);
