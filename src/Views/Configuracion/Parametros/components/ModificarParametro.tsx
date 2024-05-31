import React, { useEffect, useState } from "react";
import { useLocalization } from "../../../../Common/Hooks/useLocalization";
import { Button, Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Parametro } from "../../../../Dtos/Parametro";
import TimePicker from "rc-time-picker";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
import { ONLY_NUMBER, ONLY_NUMBER_INTEGER } from "../../../../Enums";
import { $m, moment } from "../../../../Common/Utils/Reimports";

interface Props {
  parametro?: Parametro;
  visible: boolean;
  hide: () => void;
  onSubmit: (datos: Record<"valor" | "descripcion", string>) => void;
}

const schemaString = (msg: (value: string, args?: any) => string) =>
  yup.object().shape({
    valor: yup
      .string()
      .required(msg("required"))
      .min(1, msg("min_length", { length: 1 })),
  });

const schemaFloat = (msg: (value: string, args?: any) => string) =>
  yup.object().shape({
    valor: yup
      .number()
      .typeError(msg("numeric_field", { field: "value" }))
      .required(msg("required"))
      .test(
        "maxDigitsAfterDecimal",
        msg("count_decimal", { max: 2 }),
        (valor: any) => /^\d+(\.\d{1,2})?$/.test(valor)
      ),
  });

const schemaInteger = (msg: (value: string, args?: any) => string) =>
  yup.object().shape({
    valor: yup
      .number()
      .typeError(msg("numeric_field", { field: "value" }))
      .required(msg("required"))
      .positive(msg("gte_field", { field: "value" }))
      .integer(msg("integer_field", { field: "value" })),
  });

const schemaTime = (msg: (value: string, args?: any) => string) =>
  yup.object().shape({
    // valor: yup.date().required(msg('required'))
  });

export const ModificarParametro = (props: Props) => {
  const { parametro, visible, hide, onSubmit } = props;
  const { title, label, validation } = useLocalization();
  const [schema, setSchema] = useState<any>(schemaString(validation));
  const { handleSubmit, register, errors, control, setValue } = useForm({
    validationSchema: schema,
  });
  const { capitalize: caps } = useFullIntl();

  const [checkValue, setCheckValue] = useState<string>();
  const [timeValue, setTimeValue] = useState<any>();

  useEffect(() => {
    if (!parametro) {
      return;
    }

    if (parametro!.tipoDato === "integer") {
      setSchema(schemaInteger(validation));
    } else if (parametro!.tipoDato === "double") {
      setSchema(schemaFloat(validation));
    } else if (parametro!.tipoDato === "time") {
      const time = $m(parametro!.valor, [moment.ISO_8601, "HH:mm"]);
      setTimeValue(time);
      setValue("valor", time);

      setSchema(schemaTime(validation));
    } else if (parametro!.tipoDato === "boolean") {
      setCheckValue(parametro?.valor.toString());
    } else {
      setSchema(schemaString(validation));
    }
  }, [parametro]);

  const DatePickerController = () => {
    return (
      <TimePicker
        ref={register}
        value={timeValue}
        showSecond={false}
        onChange={(e) => {
          setTimeValue(e);
          setValue("valor", e.format("HH:mm"));
        }}
        popupClassName="z-front"
        className="form-control p-0"
        placement="topLeft"
      />
    );
  };

  const inputTypeParams = () => {
    const elementParamsType = ["double", "integer", "string"].includes(
      parametro!.tipoDato
    )
      ? "TEXT"
      : parametro!.tipoDato.toUpperCase();

    const typeInput: { [key: string]: any } = {
      TEXT: (
        <>
          <Form.Control
            type="text"
            name="valor"
            defaultValue={parametro!.valor}
            ref={register}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (parametro?.tipoDato === "integer") {
                event.target.value = event.target.value.replace(
                  ONLY_NUMBER_INTEGER,
                  ""
                );
              } else if (parametro?.tipoDato === "double") {
                event.target.value = event.target.value.replace(
                  ONLY_NUMBER,
                  ""
                );
              }
            }}
          />
        </>
      ),
      BOOLEAN: (
        <>
          <Form.Check
            ref={register}
            type="radio"
            id="params-boolean-yes"
            label={caps("labels:yes")}
            name="valor"
            value="true"
            checked={checkValue === "true"}
            onChange={() => {
              setCheckValue("true");
            }}
          />

          <Form.Check
            ref={register}
            type="radio"
            label={caps("labels:no")}
            id="params-boolean-no"
            name="valor"
            value="false"
            checked={checkValue === "false"}
            onChange={() => {
              setCheckValue("false");
            }}
          />
        </>
      ),
      TIME: (
        <>
          <Controller
            as={DatePickerController}
            control={control}
            name="valor"
          />
        </>
      ),
    };

    return typeInput[elementParamsType];
  };

  if (props.parametro == null) {
    return null;
  }
  return (
    <Modal show={visible} onHide={hide}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <b>{title("modify_parameter")}</b>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              <b>{label("description")}:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              readOnly={true}
              defaultValue={parametro!.descripcion}
              ref={register}
            />
            {errors.descripcion && (
              <span className="text-danger">{errors.descripcion.message}</span>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>{label("value")}:</b>
            </Form.Label>
            {inputTypeParams()}
            {errors.valor && (
              <span className="text-danger">{errors.valor.message}</span>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button variant="primary" type="submit">
            <i className="fas fa-save mr-3" />
            {label("save_changes")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
