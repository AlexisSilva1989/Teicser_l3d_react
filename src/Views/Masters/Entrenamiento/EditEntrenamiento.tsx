import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { Buttons } from '../../../Components/Common/Buttons';
import FormEntrenamiento from '../../../Components/views/Home/Equipos/FormEntrenamiento';
import { IDataFormEntrenamiento, IEntrenamiento } from '../../../Data/Models/Entrenamiento/Entrenamiento';
import { BaseContentView } from '../../Common/BaseContentView';

export const EditEntrenamiento = () => {

  /*CUSTOM HOOKS */
  const { goBack } = useNavigation();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();
  const { getState } = useFullLocation();

  /*STATES */
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { data: element } = getState<{ data: IEntrenamiento }>();
  const [trainingSelected, setTrainingSelected] = useState<IDataFormEntrenamiento>();

  useEffect(() => {
    if (element == null || element == undefined) {
      goBack();
    } else {
      console.log('element: ', element);
      setTrainingSelected({
        id: element?.id,
        equipo: element?.equipo,
        componente: element.componente,
        initial_vars: element.initial_vars,
        segments_generate: element.segments_generate,
      });
    }
  }, []);

  /*HANDLES */
  const handleSubmit = async (data: IDataFormEntrenamiento) => {
    const formData = new FormData()
    const headers = { headers: { "Content-Type": "multipart/form-data" } }
    
    formData.append("segments", data.segments_generate)
    formData.append("id", data.id)
    data.nominal_file && formData.append("nominal_data", JSON.stringify(data.nominal_file) );
    data.critical_file && formData.append("critical_data", JSON.stringify(data.critical_file) );
    data.model_file && formData.append("model_file", data.model_file);
    data.scaler_file && formData.append("scaler_file", data.scaler_file);

    setIsSaving(true);
    await ax.patch('service_render/entrenamiento/edit', formData, headers)
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

  return (<BaseContentView title="Modificar entrenamiento">
    <div className="col-12 mb-4">
      <Buttons.Back />
    </div>
    <div className="col-12 mb-3">
      <Row>
        <Col sm='12' ><b>Equipo: </b> {trainingSelected?.equipo}</Col>
        <Col sm='12' className='mt-3'><b>Componente: </b> {trainingSelected?.componente} </Col>
      </Row>
      <FormEntrenamiento
        onSubmit={handleSubmit}
        isSaving={isSaving}
        initialData={trainingSelected}
        isEdit={true}
      />
    </div>
  </BaseContentView>
  );
};