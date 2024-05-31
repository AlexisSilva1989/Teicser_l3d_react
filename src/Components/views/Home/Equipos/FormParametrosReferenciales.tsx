import React, { useEffect } from "react";
import { Controller, ErrorMessage, useForm } from "react-hook-form";
import { Row, Col, Button } from "react-bootstrap";
import { Textbox } from "../../../Forms/Textbox";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { RadioSelect } from "../../../Forms/RadioSelect";
import { IParametrosReferencias } from "../../../../Data/Models/ParametrosReferencias/ParametrosReferencias";
import { TextArea } from "../../../Forms/TextArea";

interface IProps {
  onSubmit: (data: IParametrosReferencias) => void;
  isSaving?: boolean;
  initialData?: IParametrosReferencias;
}

const FormParametrosReferenciales = ({
  onSubmit,
  isSaving,
  initialData,
}: IProps) => {
  const { capitalize: caps } = useFullIntl();
  const { handleSubmit, errors, setValue, register, control, watch } =
    useForm<IParametrosReferencias>({
      mode: "onSubmit",
      submitFocusError: true,
    });

  const isPolinomio = watch("active_polinomio");
  const isIa = watch("active_ia");
  const isMultivariado = watch("active_multivariado");

  useEffect(() => {
    register({ name: "equipo_id" }, { required: true });
    register({ name: "componente_id" }, { required: true });
  }, [register]);

  useEffect(() => {
    if (isMultivariado === "1") {
      setValue([{ active_ia: "0" }, { active_polinomio: "0" }]);
    }
  }, [isMultivariado]);

  useEffect(() => {
    if (isPolinomio === "1" || isIa === "1") {
      setValue([{ active_multivariado: "0" }]);
    }
  }, [isIa, isPolinomio]);

  useEffect(() => {
    setValue([
      { active_ia: initialData?.active_ia ? "1" : "0" },
      { dias_ia: initialData?.dias_ia },
      { is_full_sampling_ia: initialData?.is_full_sampling_ia ? "1" : "0" },
      { num_samples_val_ia: initialData?.num_samples_val_ia },
      { num_samples_train_ia: initialData?.num_samples_train_ia },
      { ignore_cols_ia: initialData?.ignore_cols_ia },
      { critico_lifter: initialData?.critico_lifter },
      { critico_placa_a: initialData?.critico_placa_a },
      { critico_placa_b: initialData?.critico_placa_b },

      { active_polinomio: initialData?.active_polinomio ? "1" : "0" },
      { dias_pol: initialData?.dias_pol },
      { tonelaje_diario_componente: initialData?.tonelaje_diario_componente },
      { grado_pol_lifter: initialData?.grado_pol_lifter },
      { grado_pol_placa: initialData?.grado_pol_placa },
      { grado_pol_placa_b: initialData?.grado_pol_placa_b },
      { equipo_id: initialData?.equipo_id },
      { componente_id: initialData?.componente_id },

      { active_multivariado: initialData?.active_multivariado ? "1" : "0" },
      { dias_multivariado: initialData?.dias_multivariado },
    ]);
  }, [initialData]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Row>
          <Col sm={12}>
            <Col sm={12} className="px-0 border rounded">
              <Col className="pt-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  Valores Críticos
                </p>
              </Col>
              <hr />
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={0}
                  label={`Valor crítico lifter *`}
                  name={"critico_lifter"}
                  id={"critico_lifter"}
                  placeholder={"Punto crítico lifter"}
                  ref={register({
                    min: { value: 0, message: "Debe ser igual o mayor a 0" },
                  })}
                  errorForm={errors.critico_lifter}
                />
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={0}
                  label={`Valor crítico placa *`}
                  name={"critico_placa_a"}
                  id={"critico_placa_a"}
                  placeholder={"Punto crítico placa"}
                  ref={register({
                    min: { value: 0, message: "Debe ser igual o mayor a 0" },
                  })}
                  errorForm={errors.critico_placa_a}
                />
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={0}
                  label={`Valor crítico placa b *`}
                  name={"critico_placa_b"}
                  id={"critico_placa_b"}
                  placeholder={"Punto crítico placa b"}
                  ref={register({
                    min: { value: 0, message: "Debe ser igual o mayor a 0" },
                  })}
                  errorForm={errors.critico_placa_b}
                />
              </Col>
            </Col>
          </Col>

          <Col sm={12} className="pt-2">
            <Col sm={12} className="px-0 border rounded">
              <Col className="pt-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  Configuración de modelo multivariado
                </p>
              </Col>
              <hr />
              <Col sm={2}>
                <label>
                  <b>Proyectar:</b>
                </label>
                <Controller
                  control={control}
                  name={"active_multivariado"}
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
                      value: true,
                      message: caps("validations:required"),
                    },
                  }}
                  style={{ display: "inline" }}
                  as={RadioSelect}
                />
                <ErrorMessage errors={errors} name="active_multivariado">
                  {({ message }) => (
                    <small className="text-danger">{message}</small>
                  )}
                </ErrorMessage>
              </Col>

              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={1}
                  label={`Días a proyectar *`}
                  name={"dias_multivariado"}
                  id={"dias_multivariado"}
                  onlyNumber={true}
                  disabled={isMultivariado !== "1"}
                  placeholder={"Días a proyectar"}
                  ref={register({
                    required: {
                      value: isMultivariado === "1",
                      message: caps("validations:required"),
                    },
                    min: { value: 1, message: "Debe ser mayor a 0" },
                  })}
                  errorForm={errors.dias_multivariado}
                />
              </Col>
            </Col>
          </Col>

          <Col sm={12} className="pt-2">
            <Col sm={12} className="px-0 border rounded">
              <Col className="pt-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  Configuración de polinomio
                </p>
              </Col>
              <hr />
              <Col sm={2}>
                <label>
                  <b>Proyectar:</b>
                </label>
                <Controller
                  control={control}
                  name={"active_polinomio"}
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
                      value: true,
                      message: caps("validations:required"),
                    },
                  }}
                  style={{ display: "inline" }}
                  as={RadioSelect}
                />
                <ErrorMessage errors={errors} name="active_polinomio">
                  {({ message }) => (
                    <small className="text-danger">{message}</small>
                  )}
                </ErrorMessage>
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={1}
                  label={`Días con polinomio *`}
                  name={"dias_pol"}
                  id={"dias_pol"}
                  onlyNumber={true}
                  disabled={isPolinomio !== "1"}
                  placeholder={"Días a proyectar"}
                  ref={register({
                    required: {
                      value: isPolinomio === "1",
                      message: caps("validations:required"),
                    },
                    min: { value: 1, message: "Debe ser mayor a 0" },
                  })}
                  errorForm={errors.dias_pol}
                />
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  label={`Tonelaje diario *`}
                  name={"tonelaje_diario_componente"}
                  id={"tonelaje_diario_componente"}
                  onlyNumber={true}
                  disabled={isPolinomio !== "1"}
                  placeholder={"Tonelaje procesado"}
                  ref={register({
                    required: {
                      value: isPolinomio === "1",
                      message: caps("validations:required"),
                    },
                    min: { value: 0, message: "Debe ser igual 0 mayor a 0" },
                  })}
                  errorForm={errors.tonelaje_diario_componente}
                />
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={1}
                  label={`Grado lifter *`}
                  name={"grado_pol_lifter"}
                  id={"grado_pol_lifter"}
                  onlyNumber={true}
                  disabled={isPolinomio !== "1"}
                  placeholder={"Grado polinomio"}
                  ref={register({
                    required: {
                      value: isPolinomio === "1",
                      message: caps("validations:required"),
                    },
                  })}
                  errorForm={errors.grado_pol_lifter}
                />
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={1}
                  label={`Grado placa *`}
                  name={"grado_pol_placa"}
                  id={"grado_pol_placa"}
                  onlyNumber={true}
                  disabled={isPolinomio !== "1"}
                  placeholder={"Grado polinomio"}
                  ref={register({
                    required: {
                      value: isPolinomio === "1",
                      message: caps("validations:required"),
                    },
                  })}
                  errorForm={errors.grado_pol_placa}
                />
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={1}
                  label={`Grado placa b`}
                  name={"grado_pol_placa_b"}
                  id={"grado_pol_placa_b"}
                  onlyNumber={true}
                  disabled={isPolinomio !== "1"}
                  placeholder={"Grado polinomio"}
                  ref={register()}
                  errorForm={errors.grado_pol_placa_b}
                />
              </Col>
            </Col>
          </Col>

          <Col sm={12} className="pt-2">
            <Col sm={12} className="px-0 border rounded">
              <Col className="pt-3">
                <p
                  className="mb-0"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                >
                  Configuración de IA
                </p>
              </Col>
              <hr />
              <Col sm={2}>
                <label>
                  <b>Proyectar:</b>
                </label>
                <Controller
                  control={control}
                  name={"active_ia"}
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
                      value: true,
                      message: caps("validations:required"),
                    },
                  }}
                  style={{ display: "inline" }}
                  as={RadioSelect}
                />
                <ErrorMessage errors={errors} name="status">
                  {({ message }) => (
                    <small className="text-danger">{message}</small>
                  )}
                </ErrorMessage>
              </Col>
              <Col sm={2} className={"mb-2"}>
                <Textbox
                  type="number"
                  min={1}
                  label={`Días con IA *`}
                  name={"dias_ia"}
                  id={"dias_ia"}
                  // onlyNumber={true}
                  disabled={isIa !== "1"}
                  placeholder={"Días a proyectar"}
                  ref={register({
                    required: {
                      value: isIa === "1",
                      message: caps("validations:required"),
                    },
                    min: { value: 1, message: "Debe ser mayor a 0" },
                  })}
                  errorForm={errors.dias_ia}
                />
              </Col>

              <Col className="px-0">
                <hr className="mt-0" />
                <Col className="pt-1">
                  <p
                    className="mb-0"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                  >
                    Configuración de entrenamiento IA
                  </p>
                </Col>
                <hr />
                <Col sm={4}>
                  <label>
                    <b>Periodo a considerar:</b>
                  </label>
                  <Controller
                    control={control}
                    name={"is_full_sampling_ia"}
                    options={[
                      {
                        label: "Campaña completa",
                        value: "1",
                      },
                      {
                        label: "Últimos 30 días",
                        value: "0",
                      },
                    ]}
                    rules={{
                      required: {
                        value: isIa === "1",
                        message: caps("validations:required"),
                      },
                    }}
                    style={{ display: "inline" }}
                    disabled={isIa !== "1"}
                    as={RadioSelect}
                  />
                  <ErrorMessage errors={errors} name="status">
                    {({ message }) => (
                      <small className="text-danger">{message}</small>
                    )}
                  </ErrorMessage>
                </Col>

                <Col sm={3} className={"mb-2"}>
                  <Textbox
                    type="number"
                    min={1}
                    label={`Entrenamiento (Num. samples) *`}
                    name={"num_samples_train_ia"}
                    id={"num_samples_train_ia"}
                    disabled={isIa !== "1"}
                    placeholder={"Num samples"}
                    ref={register({
                      required: {
                        value: isIa === "1",
                        message: caps("validations:required"),
                      },
                      min: {
                        value: 100,
                        message: "Se recomiendan almenos 100 samples",
                      },
                    })}
                    errorForm={errors.num_samples_train_ia}
                  />
                </Col>

                <Col sm={3} className={"mb-2"}>
                  <Textbox
                    type="number"
                    min={1}
                    label={`Validación (Num. samples) *`}
                    name={"num_samples_val_ia"}
                    id={"num_samples_val_ia"}
                    disabled={isIa !== "1"}
                    placeholder={"Num samples"}
                    ref={register({
                      required: {
                        value: isIa === "1",
                        message: caps("validations:required"),
                      },
                      min: {
                        value: 100,
                        message: "Se recomiendan almenos 100 samples",
                      },
                    })}
                    step={1}
                    errorForm={errors.num_samples_val_ia}
                  />
                </Col>

                <Col sm={12} className="pb-2">
                  <TextArea
                    label="Columnas a ignorar *"
                    name="ignore_cols_ia"
                    rows={2}
                    disabled={isIa !== "1"}
                    ref={register({
                      required: {
                        value: isIa === "1",
                        message: caps("validations:required"),
                      },
                    })}
                    placeholder='Agregar un array usando comillas dobles. Ejem: ["TON_ALIM","PRES_DESC_2"]'
                    errorForm={errors.ignore_cols_ia}
                  />
                </Col>
              </Col>
            </Col>
          </Col>
        </Row>

        <Row>
          <Col sm={12} className={"text-right mt-3"}>
            <Button variant={"primary"} type="submit" disabled={isSaving}>
              {isSaving ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <>
                  {" "}
                  <i className="fas fa-save mr-3" /> {"Guardar"}{" "}
                </>
              )}
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default FormParametrosReferenciales;
