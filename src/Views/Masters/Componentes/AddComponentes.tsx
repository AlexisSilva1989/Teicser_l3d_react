import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormComponente from '../../../Components/views/Home/Equipos/FormComponente';
import { IDataFormComponente } from '../../../Data/Models/Componentes/Componentes';
import { BaseContentView } from '../../Common/BaseContentView';

export const AddComponentes = () => {

  /*CUSTOM HOOKS */
  const { goBack } = useNavigation();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();

  /*STATES */
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /*HANDLES */
  const handleSubmit = async (data: IDataFormComponente) => {
    setIsSaving(true);
    await ax.post('service_render/componentes/save', data)
      .then((response) => {
        goBack();
        addToast(caps('success:base.save'), { appearance: 'success', autoDismiss: true });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(e.response.data.errors ? e.response.data.errors[Object.keys(e.response.data.errors)[0]] : caps('errors:base.post', { element: "componente" }),
            { appearance: 'error', autoDismiss: true }
          );
        }
      })
      .finally(() => { setIsSaving(false) });
  };

  return (<BaseContentView title="Agregar Componente">
    <div className="col-12 mb-4">
      <Buttons.Back />
    </div>
    <div className="col-12 mb-3">
      <FormComponente
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />
    </div>
  </BaseContentView>
  );
};