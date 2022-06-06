import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useApi } from '../../../Common/Hooks/useApi';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormComponente from '../../../Components/views/Home/Equipos/FormComponente';
import { IComponente, IDataFormComponente } from '../../../Data/Models/Componentes/Componentes';
import { BaseContentView } from '../../Common/BaseContentView';

export const EditComponentes = () => {

  /*CUSTOM HOOKS */
  const { goBack } = useNavigation();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();
  const { getState } = useFullLocation();

  /*STATES */
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { data: element } = getState<{ data: IComponente }>();
  const [componenteSelected, setComponenteSelected] = useState<IDataFormComponente>();

  useEffect(() => {
    if (element == null || element == undefined) {
      goBack();
    } else {
      setComponenteSelected({
        nombre: element?.nombre,
        status: element?.status,
        id: element?.id,
      });


    }
  }, []);

  /*HANDLES */
  const handleSubmit = async (data: IDataFormComponente) => {
    setIsSaving(true);
    await ax.patch('service_render/componentes/edit', data)
      .then((response) => {
        goBack();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
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

  return (<BaseContentView title="Modificar Componente">
    <div className="col-12 mb-4">
      <Buttons.Back />
    </div>
    <div className="col-12 mb-3">
      <FormComponente
        onSubmit={handleSubmit}
        isSaving={isSaving}
        initialData={componenteSelected}
        isEdit={true}
      />
    </div>
  </BaseContentView>
  );
};