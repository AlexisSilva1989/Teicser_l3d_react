import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { IDataFormEquipo } from "../../../../Data/Models/Equipo/Equipo";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { IDataFormServer } from "../../../../Data/Models/Servidor/Servidor";
import { RadioSelect } from "../../../Forms/RadioSelect";

interface IProps {
  onSubmit: (data: IDataFormServer) => void;
  isSaving?: boolean;
  initialData?: IDataFormServer;
  isEdit?: boolean;
}

const FormServer = ({
  onSubmit,
  isSaving,
  initialData,
  isEdit = false,
}: IProps) => {
  const { capitalize: caps } = useFullIntl();
  const {
    handleSubmit,
    errors,
    setValue,
    register,
    control,
    setError,
    clearError,
  } = useForm<IDataFormServer>({
    mode: "onSubmit",
    submitFocusError: true,
  });

  useEffect(() => {
    {
      isEdit && register({ name: "id" }, { required: true });
    }
  }, [register]);

  useEffect(() => {
    setValue([
      { name: initialData?.name },
      { url: initialData?.url },
      { status: initialData?.status?.toString() },
      { id: initialData?.id },
    ]);
  }, [initialData]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={3} className={"mb-2"}>
            <Textbox
              label={`Alias *`}
              name={"name"}
              id={"alias_server"}
              placeholder={"Alias del servidor"}
              ref={register({
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
                maxLength: {
                  value: 25,
                  message: "Máximo 25 caracteres permitidos",
                },
              })}
              errorForm={errors.name}
            />
          </Col>
          <Col sm={3} className={"mb-2"}>
            <Textbox
              label={`URL *`}
              name={"url"}
              id={"url_server"}
              placeholder={"dirección del servidor"}
              ref={register({
                required: {
                  value: true,
                  message: caps("validations:required"),
                },
              })}
              errorForm={errors.url}
            />
          </Col>

          {isEdit && (
            <Col sm={3}>
              <label>
                <b>Activo:</b>
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
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : isEdit ? (
                <>
                  {" "}
                  <i className="fas fa-save mr-3" /> {"Guardar"}{" "}
                </>
              ) : (
                <>
                  {" "}
                  <i className="fas fa-plus mr-3" /> {"Agregar"}{" "}
                </>
              )}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default FormServer;
