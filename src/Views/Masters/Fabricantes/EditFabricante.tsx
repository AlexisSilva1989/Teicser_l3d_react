import React, { useEffect, useState } from "react";
import { BaseContentView } from "../../Common/BaseContentView";
import { Buttons } from "../../../Components/Common/Buttons";
import FormFabricante from "../../../Components/views/Home/Fabricante/FormFabricante";
import { useApi } from "../../../Common/Hooks/useApi";
import { useNavigation } from "../../../Common/Hooks/useNavigation";
import { useToasts } from "react-toast-notifications";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { useFullLocation } from "../../../Common/Hooks/useFullLocation";
import {
  Fabricante,
  IDataFormFabricante,
} from "../../../Data/Models/Fabricante/Fabricante";

const EditFabricante = () => {
  /*CUSTOM HOOKS */
  const api = useApi();
  const { goBack } = useNavigation();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();
  const { getState } = useFullLocation();

  /*STATES */
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { data: element } = getState<{ data: Fabricante }>();
  const [fabricanteSelected, setFabricanteSelected] =
    useState<IDataFormFabricante>();

  useEffect(() => {
    if (element == null || element == undefined) {
      goBack();
    } else {
      setFabricanteSelected({
        id: element?.id,
        name: element?.name,
        status: element?.status,
      });
    }
  }, []);

  /*HANDLES */
  const handleSubmit = async (data: any) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("id_fabricante", data.id);
    formData.append("nombre", data.name);
    formData.append(
      "components_selected",
      JSON.stringify(data.components_selected)
    );
    data?.status && formData.append("status", data?.status);

    setIsSaving(true);
    await ax
      .patch("fabricantes", formData, headers)
      .then((response) => {
        goBack();
        addToast(caps("success:base.save"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps("errors:base.post", { element: "equipo" }), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <BaseContentView title="Modificar Fabricante">
      <div className="col-12 mb-4">
        <Buttons.Back />
      </div>
      <div className="col-12 mb-3">
        <FormFabricante
          onSubmit={handleSubmit}
          isSaving={isSaving}
          initialData={fabricanteSelected}
          isEdit={true}
        />
      </div>
    </BaseContentView>
  );
};

export default EditFabricante;
