import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useApi } from '../../../Common/Hooks/useApi';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormEquipo from '../../../Components/views/Home/Equipos/FormEquipo';
import { EquipoTipo, IDataFormEquipo } from '../../../Data/Models/Equipo/Equipo';
import { BaseContentView } from '../../Common/BaseContentView';

export const EditEquipo = ( ) => {

    /*CUSTOM HOOKS */
    const api = useApi();
    const { goBack } = useNavigation();
    const { addToast } = useToasts();
    const { capitalize: caps } = useFullIntl();
    const { getState } = useFullLocation();
    // const { goBack } = useCommonRoutes();

    /*STATES */
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { data: element } = getState<{ data: EquipoTipo }>();
    const [equipoSelected, setEquipoSelected] = useState<IDataFormEquipo>();
    
    useEffect(() => {
      if (element == null || element== undefined) {
        goBack();
      }else{
        setEquipoSelected({
          name:element?.nombre,
          tipo_equipo:{label:element?.tipo, value:element?.tipo},
          status: element?.status,
          id: element?.id
        });
      }

    },[]);
    /*HANDLES */
    const handleSubmit = async (data: IDataFormEquipo) => {
        console.log('data: ', data);
        const formData = new FormData();
		    const headers = { headers: { "Content-Type": "multipart/form-data" } };
        
        formData.append("nombre", data.name);
        formData.append("tipo_equipo", data.tipo_equipo.value);
        data?.id && formData.append("id_equipo", data?.id);
        data?.status && formData.append("status", data?.status);
        data.file_model && formData.append("file_model", data.file_model);
        data.file_scaler && formData.append("file_scaler", data.file_scaler);
        
        setIsSaving(true);
        await ax.patch('service_render/equipos/edit', formData, headers)
          .then((response) => {
            // goBack();
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
                initialData={equipoSelected}
                isEdit={true} 
            />
        </div>
      </BaseContentView>
    );
  };