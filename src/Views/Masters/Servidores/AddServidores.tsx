import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useApi } from '../../../Common/Hooks/useApi';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormServer from '../../../Components/views/Home/servers/FormServer';
import { IDataFormServer } from '../../../Data/Models/Servidor/Servidor';
import { BaseContentView } from '../../Common/BaseContentView';

export const AddServidores = ( ) => {

    /*CUSTOM HOOKS */
    const api = useApi();
    const { goBack } = useNavigation();
    const { addToast } = useToasts();
    const { capitalize: caps } = useFullIntl();

    /*STATES */
    const [isSaving, setIsSaving] = useState<boolean>(false);

    /*HANDLES */
    const handleSubmit = async (data: IDataFormServer) => {
        setIsSaving(true);
        await ax.post('service_render/servidores/save', data)
          .then((response) => {
            goBack();
            addToast(caps('success:base.save'), { appearance: 'success', autoDismiss: true });
          })
          .catch((e: AxiosError) => {
            if (e.response) {
              addToast(e.response.data.errors ? e.response.data.errors[Object.keys(e.response.data.errors)[0]] : caps('errors:base.post', { element: "servidor"}),
                { appearance: 'error', autoDismiss: true }
              );
            }
          })
          .finally(() => { setIsSaving(false) });
    };

    return (<BaseContentView title="Agregar Servidor">
        <div className="col-12 mb-4">
          <Buttons.Back />
        </div>
        <div className="col-12 mb-3">
            <FormServer 
                onSubmit={handleSubmit}
                isSaving={isSaving} 
            />
        </div>
      </BaseContentView>
    );
  };