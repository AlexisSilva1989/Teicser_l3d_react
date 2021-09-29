import React from 'react';
import './../../Assets/scss/style.scss';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { ValidatedForm, TEXTBOX, PASSWORD } from '../../Components/Forms/ValidatedForm';
import { BaseLoginComponent } from './BaseLoginComponent';
import { ax } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../Common/Hooks/useDashboard';
import { $j } from '../../Common/Utils/Reimports';
import  { Link } from 'react-router-dom'

export const RestablecerContrasena = () => {
	const { capitalize: caps } = useFullIntl();
    const {setLoading} = useDashboard();
    const { addToast } = useToasts();

    async function onSubmit(data: { email: string }) {
		setLoading(true);
		let responseMessage : string;
		let  appearanceMessage : AppearanceTypes;

		await ax.post($j('password/email'), data).then((response) => {
			responseMessage = response.data.hasOwnProperty('error') ? response.data.error : response.data.success;
			appearanceMessage = response.data.hasOwnProperty('error') ? 'error' : 'success' ;	
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


	return <BaseLoginComponent tittle={caps('labels:forget_password')}>
		<ValidatedForm submitIcon='' submitLabel='labels:links.recovery_password' onSubmit={onSubmit}
			validations={{
				email: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required', {
							field: caps('labels:inputs.email')
						})
					},
					email:{
						message: caps('validations:email')
					}
				},
			}} fields={[
				{
					type: TEXTBOX,
					name: 'email',
					placeholder: 'validations:placeholders.email_recovery'
				}
			]} 
		/>
		<Link to="/">{caps('labels:links.signin')}</Link>
	</BaseLoginComponent>

};
