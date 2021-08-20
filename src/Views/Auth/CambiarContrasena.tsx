import { AxiosError } from 'axios';
import md5 from 'md5';
import React, { useEffect, useState } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../Common/Hooks/useDashboard';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useReset } from '../../Common/Hooks/useReset';
import { ax } from '../../Common/Utils/AxiosCustom';
import { $j, $u } from '../../Common/Utils/Reimports';
import { PASSWORD, TEXTBOX, ValidatedForm } from '../../Components/Forms/ValidatedForm';
import { BaseContentView } from '../Common/BaseContentView';

interface IDataForm {
    password_current: string,
    password_new: string , 
    password_new_confirmation: string 
}

const dataInitial : IDataForm = {
    password_current : '',
    password_new : '',
    password_new_confirmation : ''
}

export const CambiarContrasena = () => {

    const { capitalize: caps } = useFullIntl();
    const { addToast } = useToasts();
    const { setLoading } = useDashboard();

	const [resetForm, doResetForm] = useReset();

    async function onSubmit(data: IDataForm) {
        setLoading(true);
        let responseMessage: string;
        let appearanceMessage: AppearanceTypes;
        const dataSend = {
            password_current: md5(data?.password_current),
            password_new: md5(data.password_new),
            password_new_confirmation: md5(data.password_new_confirmation)
        };

        await ax.post($j('usuarios/change_password'), dataSend).then((response) => {
            let isError = response.data.hasOwnProperty('error');
            responseMessage = isError ? response.data.error : response.data.success;
            appearanceMessage = isError ? 'error' : 'success';
            !isError && doResetForm();
        }).catch((e: AxiosError) => {
            if (e.response) {
                responseMessage = e.response.data.errors ? e.response.data.errors[Object.keys(e.response.data.errors)[0]] : e.message;
                appearanceMessage = 'error';
            }
        }).finally(() => {
            setLoading(false);
            addToast(responseMessage, {
                appearance: appearanceMessage,
                autoDismiss: true,
            });
           
        });

    }
   
    return <BaseContentView title='titles:change_password'>
        <div className='col-4' style={{ 'margin': 'auto' }}>
            <ValidatedForm submitIcon='' submitLabel='labels:links.change_my_password' onSubmit={onSubmit}
                reset = {resetForm}
                validations={{
                    password_current: {
                        presence: {
                            allowEmpty: false,
                            message: caps('validations:required', { field: caps('labels:inputs.password') })
                        }
                    },
                    password_new: {
                        presence: {
                            allowEmpty: false,
                            message: caps('validations:required', { field: caps('labels:inputs.password') })
                        },
                        length: {
                            minimum: 8,
                            tooShort: caps('validations:min_length', { count: 8 })
                        }
                    },
                    password_new_confirmation: {
                        presence: {
                            allowEmpty: false,
                            message: caps('validations:required', { field: caps('labels:inputs.password') })
                        },
                        equality: {
                            equality: "password_new",
                            attribute: "password_new",
                            message: caps('validations:password_not_confirmated')
                        }
                    }
                }} fields={[
                    {
                        type: PASSWORD,
                        name: 'password_current',
                        placeholder: 'labels:inputs.password_current',
                        reset: true, 
                        value: dataInitial.password_current,
                    },
                    {
                        type: PASSWORD,
                        name: 'password_new',
                        placeholder: 'labels:inputs.password_new',
                        reset: true,
                        value: dataInitial.password_new
                    },
                    {
                        type: PASSWORD,
                        name: 'password_new_confirmation',
                        placeholder: 'validations:placeholders.confirm_password',
                        reset: true,
                        value: dataInitial.password_new_confirmation
                    }
                ]}
            />
        </div>
    </BaseContentView>
}