import React, { useState } from 'react'
import { BaseContentView } from '../../Common/BaseContentView';
import { Buttons } from '../../../Components/Common/Buttons';
import FormFabricante from '../../../Components/views/Home/Fabricante/FormFabricante';
import { useApi } from '../../../Common/Hooks/useApi';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { IDataFormFabricante } from '../../../Data/Models/Fabricante/Fabricante';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';

const AddFabricante = () => {

  /*CUSTOM HOOKS */
  const api = useApi();
  const { goBack } = useNavigation();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();

  /*STATES */
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /*HANDLES */
  const handleSubmit = async (data: IDataFormFabricante) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("nombre", data.name);
    formData.append("components_selected", JSON.stringify(data.components_selected));

    setIsSaving(true);
    await ax.post('fabricantes', formData, headers)
      .then((response) => {
        goBack();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.post', { element: "equipo" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      })
      .finally(() => { setIsSaving(false) });
  };

  return (<BaseContentView title="Agregar Fabricante">
    <div className="col-12 mb-4">
      <Buttons.Back />
    </div>
    <div className="col-12 mb-3">
      <FormFabricante
        onSubmit={handleSubmit}
      // isSaving={isSaving} 
      />
    </div>
  </BaseContentView>
  );
}

export default AddFabricante