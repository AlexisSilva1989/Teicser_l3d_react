import {  useEffect, useState } from 'react';
import { ax } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { HOME_QUALITZER } from '../../Config';
interface Empresa {
	logo: string
	nombre_sistema: string
	imagen_principal: string
	industria: string
}

export const useEmpresa = () => {
	const [datosEmpresa, setDatosEmpresa] = useState<Empresa>({ logo: "", nombre_sistema: "", imagen_principal: "", industria: ""});

	useEffect(() => {
		async function feat(){
			await ax.get<any>('empresa').then(response => {
				const dataEmpresa = response.data;

				localStorage.setItem('logo', dataEmpresa.logo);
				localStorage.setItem('nombre_sistema', dataEmpresa.nombre_sistema);
				localStorage.setItem('imagen_principal', dataEmpresa.imagen_principal);
				localStorage.setItem('industria', dataEmpresa.industria.toLowerCase().replace(/ /g,"_"));
				
				setDatosEmpresa(
					{
						logo: dataEmpresa.logo,
						nombre_sistema: dataEmpresa.nombre_sistema,
						imagen_principal: dataEmpresa.imagen_principal,
						industria: dataEmpresa.industria.toLowerCase().replace(/ /g,"_")
					}
				)
			}).catch((error : AxiosError) => {
				const isRedirectToRegister =  error.response?.data.message === 'client_no_found' && error.response?.status === 403
				if(isRedirectToRegister){
					window.location.replace(HOME_QUALITZER);
				}
			});
		}
		feat();	
	}, []);

	return datosEmpresa;
};


export const useEmpresaLabel = (label:string) => {

	return ( localStorage.getItem('industria') ? label + '.' + localStorage.getItem('industria')?.toLowerCase() : label );
};


export const useEmpresaTipo = (tipo:string) => {

	return ( localStorage.getItem('industria') === tipo ? true : false );
};

