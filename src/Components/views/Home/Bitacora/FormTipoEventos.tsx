import React, { useEffect, useState } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { RadioSelect } from "../../../Forms/RadioSelect";

import { ApiSelect } from "../../../Api/ApiSelect";
import { $j } from "../../../../Common/Utils/Reimports";
import {
  BitacoraComponentesColumns,
  BitacoraComponentesForm,
} from "../../../../Data/Models/Binnacle/BitacoraComponentes";
import { useShortModal } from "../../../../Common/Hooks/useModal";
import { SelectAdd } from "../../../Forms/SelectAdd";
import FabricanteFormModal from "../../../Modals/FabricanteFormModal";
import { ax } from "../../../../Common/Utils/AxiosCustom";
import { useReload } from "../../../../Common/Hooks/useReload";
import { useToasts } from "react-toast-notifications";
import { AxiosError } from "axios";
import { IDataFormFabricante } from "../../../../Data/Models/Fabricante/Fabricante";
import {
  TypeEventsColumns,
  TypeEventsForm,
} from "../../../../Data/Models/Binnacle/TypeEvents";
interface IProps {
  onSubmit: (data: TypeEventsForm) => void;
  isSaving?: boolean;
  initialData?: Partial<TypeEventsColumns>;
  isEdit?: boolean;
}

const FormTipoEventos = ({
  onSubmit,
  isSaving,
  initialData,
  isEdit = false,
}: IProps) => {
  //hooks
  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, control, errors, setValue, register } =
    useForm<TypeEventsForm>({
      mode: "onSubmit",
      submitFocusError: true,
    });
  const manufacturersModal = useShortModal();
  const { addToast } = useToasts();

  const [isLoadingFabricante, setIsLoadingFabricante] = useState(false);
  const [reloadManufacturersList, doReloadManufacturersList] = useReload();
  const [manufacturerAux, setManufacturerAux] = useState<
    IDataFormFabricante | undefined
  >();
  const [isSavingManufacturer, setIsSavingManufacturer] = useState(false);

  //methods

  //effects
  useEffect(() => {
    {
      isEdit && register({ name: "id" }, { required: true });
    }
  }, [register]);

  useEffect(() => {
    setValue([
      { nombre: initialData?.nombre },
      { jerarquia: initialData?.jerarquia },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);
  }, [initialData]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={12} className={"mb-2"}>
            <Textbox
              label={`Nombre *`}
              name={"nombre"}
              id={"nombre"}
              placeholder={"Nombre"}
              ref={register({
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres permitidos",
                },
              })}
              errorForm={errors.nombre}
            />
          </Col>
          <Col sm={12} className={"mb-2"}>
            <Textbox
              label={`Jerarquía`}
              name={"jerarquia"}
              id={"jerarquia"}
              placeholder={"Ingrese un valor numérico"}
              type="number"
              ref={register({})}
              errorForm={errors.jerarquia}
            />
          </Col>

          {isEdit && (
            <Col sm={12}>
              <label>
                <b>Activo *:</b>
              </label>
              <Controller
                control={control}
                name={"status"}
                options={[
                  {
                    label: "Si",
                    value: "1",
                  },
                  {
                    label: "No",
                    value: "0",
                  },
                ]}
                rules={{
                  required: {
                    value: !isEdit,
                    message: caps("validations:required"),
                  },
                }}
                as={RadioSelect}
              />

              <ErrorMessage errors={errors} name="status">
                {({ message }) => (
                  <small className="text-danger">{message}</small>
                )}
              </ErrorMessage>
            </Col>
          )}
        </Row>

        <Row>
          <Col sm={12} className={"text-right mt-3"}>
            <Button variant={"primary"} type="submit" disabled={isSaving}>
              {isSaving ? (
                <i className="fas fa-circle-notch fa-spin mr-3"></i>
              ) : isEdit ? (
                <i className="fas fa-save mr-3" />
              ) : (
                <i className="fas fa-plus mr-3" />
              )}
              {isEdit ? "Guardar" : "Agregar"}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default FormTipoEventos;
