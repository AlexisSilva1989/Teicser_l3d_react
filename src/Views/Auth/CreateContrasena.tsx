import React, { useState } from 'react';
import './../../Assets/scss/style.scss';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { ValidatedForm, TEXTBOX, PASSWORD } from '../../Components/Forms/ValidatedForm';
import md5 from 'md5';
import { BaseLoginComponent } from './BaseLoginComponent';
import { Redirect, useParams } from "react-router-dom";
import { ax } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../Common/Hooks/useDashboard';
import { $j } from '../../Common/Utils/Reimports';

interface Params {
	token?: string,
	email?: string,
}

interface DataSend{
	token: string,
	email: string,
	password: string,
	password_confirmation: string
}

export const CreateContrasena = () => {

	const { capitalize: caps } = useFullIntl();
	const params : Params = useParams();
    const {setLoading} = useDashboard();
    const { addToast } = useToasts();
	const [redirect , setRedirect] = useState<boolean>(false);

    async function onSubmit(data: { password: string , token: string, email: string , password_confirmation: string}) {
		
		setLoading(true);
		const dataSend : DataSend = {
			...data,
			password : md5(data.password),
			password_confirmation : md5(data.password_confirmation)

		};
		let responseMessage : string;
		let  appearanceMessage : AppearanceTypes;
		await ax.post($j('password/reset'), dataSend).then((response) => {
			responseMessage = response.data.hasOwnProperty('error') || response.hasOwnProperty('errors') ? response.data.error : response.data.success;
			appearanceMessage = response.data.hasOwnProperty('error') || response.data.hasOwnProperty('errors') ? 'error' : 'success' ;
			setRedirect(true);
		}).catch((e: AxiosError) => {
			if (e.response) {
				responseMessage = e.response.data.error ? e.response.data.error : e.response.data.message;
				appearanceMessage ='error';
            }
		}).finally(()=>{
			addToast(responseMessage, {
				appearance: appearanceMessage,
				autoDismiss: true,
			});
		});
		setLoading(false);
	}

	if(redirect){
		return <Redirect to="/"/>
	}

	return <BaseLoginComponent tittle={caps('labels:create_password')}>
		<ValidatedForm submitIcon='' submitLabel='labels:links.create_password' onSubmit={onSubmit}
			validations={{
				password: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required', {
							field: caps('labels:inputs.password')
						})
					},
					length: {
						minimum: 8,
						tooShort: caps('validations:min_length', { count: 8 })
					}
				},
				password_confirmation:{
					equality : {
						equality: "password",
						attribute: "password",
						message: caps('validations:password_not_confirmated')
					}
				}

			}} fields={[
				{
					type: TEXTBOX,
					name: 'email',
					placeholder: 'labels:inputs.username',
					readonly: true,
					value: params.email,
				},
				{
					type: PASSWORD,
					name: 'password',
					placeholder: 'labels:inputs.password'
				},
				{
					type: PASSWORD,
					name: 'password_confirmation',
					placeholder: 'validations:placeholders.confirm_password'
				},
				{
					type: TEXTBOX,
					name: 'token',
					value: params.token,
					hidden: true

				}
			]} 
		/>
	</BaseLoginComponent>

};
