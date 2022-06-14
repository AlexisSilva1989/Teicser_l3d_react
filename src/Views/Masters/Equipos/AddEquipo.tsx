import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useApi } from '../../../Common/Hooks/useApi';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormEquipo from '../../../Components/views/Home/Equipos/FormEquipo';
import { IDataFormEquipo } from '../../../Data/Models/Equipo/Equipo';
import { BaseContentView } from '../../Common/BaseContentView';

export const AddEquipo = ( ) => {

    /*CUSTOM HOOKS */
    const api = useApi();
    const { goBack } = useNavigation();
    const { addToast } = useToasts();
    const { capitalize: caps } = useFullIntl();

    /*STATES */
    const [isSaving, setIsSaving] = useState<boolean>(false);

    /*HANDLES */
    const handleSubmit = async (data: IDataFormEquipo) => {
        const formData = new FormData();
		    const headers = { headers: { "Content-Type": "multipart/form-data" } };
        formData.append("nombre", data.name);
        formData.append("tipo_equipo", data.tipo_equipo);
        formData.append("server_selected", JSON.stringify(data.server_selected));
        formData.append("components_selected", JSON.stringify(data.components_selected));
        
        // formData.append("file_model", data.file_model);
        // formData.append("file_scaler", data.file_scaler);
        // // formData.append("file_checkpoint", data.file_checkpoint);
        // data.perfil_nominal && formData.append("perfil_nominal", JSON.stringify(data.perfil_nominal) );
        // data.perfil_critico && formData.append("perfil_critico", JSON.stringify(data.perfil_critico) );
        
        // 
        setIsSaving(true);
        await ax.post('service_render/equipos/save', formData, headers)
          .then((response) => {
            goBack();
            addToast(caps('success:base.save'), {
              appearance: 'success',
              autoDismiss: true,
            });
          })
          .catch((e: AxiosError) => {
            if (e.response) {
              addToast(caps('errors:base.post', { element: "equipo"}), {
                appearance: 'error',
                autoDismiss: true,
              });
            }
          })
          .finally(() => { setIsSaving(false) });
    };

    return (<BaseContentView title="Agregar Equipo">
        <div className="col-12 mb-4">
          <Buttons.Back />
        </div>
        <div className="col-12 mb-3">
            <FormEquipo 
                onSubmit={handleSubmit}
                isSaving={isSaving} 
            />
        </div>
      </BaseContentView>
    );
  };