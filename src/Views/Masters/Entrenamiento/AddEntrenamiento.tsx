import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useApi } from '../../../Common/Hooks/useApi';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormEntrenamiento from '../../../Components/views/Home/Equipos/FormEntrenamiento';
import { IDataFormEntrenamiento } from '../../../Data/Models/Entrenamiento/Entrenamiento';
import { BaseContentView } from '../../Common/BaseContentView';

export const AddEntrenamiento = () => {

  /*CUSTOM HOOKS */
  const { goBack } = useNavigation();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();

  /*STATES */
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /*HANDLES */
  const handleSubmit = async (data: IDataFormEntrenamiento) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    
    formData.append("segments", data.segments_generate)
    formData.append("id", data.id)
    
    formData.append("scaler_file", data.scaler_file);
    formData.append("model_file", data.model_file);
    data.componente && formData.append("componente", data.componente);
    data.nominal_file && formData.append("nominal_data", JSON.stringify(data.critical_file) );
    data.critical_file && formData.append("critical_data", JSON.stringify(data.critical_file) );
    
    setIsSaving(true);
    await ax.post('service_render/entrenamiento/save', formData, headers)
      .then((response) => {
        goBack();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.post', { element: "entrenamiento"}), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      })
      .finally(() => { setIsSaving(false) });
  };

  return (<BaseContentView title="Agregar ">
    <div className="col-12 mb-4">
      <Buttons.Back />
    </div>
    <div className="col-12 mb-3">
      <FormEntrenamiento
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />
    </div>
  </BaseContentView>
  );
};