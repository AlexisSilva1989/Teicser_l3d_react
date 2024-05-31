import { Empresa } from "../../../Data/Models/Configuracion/Empresa";
import React, { useState, Fragment, useRef, useEffect } from "react";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import {
  TEXTBOX,
  TEXTAREA,
  FILE_INPUT_PREVIEW,
  ValidatedForm,
} from "../../../Components/Forms/ValidatedForm";
import { $u, $j } from "../../../Common/Utils/Reimports";
import { useApi } from "../../../Common/Hooks/useApi";
import { BaseContentView } from "../../Common/BaseContentView";
import { BounceLoader } from "react-spinners";
import { useToasts } from "react-toast-notifications";
import { AxiosError } from "axios";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useDashboard } from "../../../Common/Hooks/useDashboard";
import { useEmpresa } from "../../../Common/Hooks/useEmpresa";

export const ModificarEmpresa = () => {
  interface TRaw {
    nombre_sistema: string;
    rut: string;
    nombre: string;
    direccion: string;
    telefono?: string;
    email?: string;
    web?: string;
    logo: string;
    imagen_principal: string;
  }

  /* Function hooks */
  const api = useApi();
  const { localize, capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const datosEmpresa = useEmpresa();
  const { setLoading } = useDashboard();

  /* State hooks */
  const [empresa, setEmpresa] = useState<Empresa>();
  const [isLoad, setLoad] = useState<boolean>(true);

  useEffect(() => {
    async function fetch() {
      await api
        .get<Empresa>("empresa/perfil")
        .success((data) => {
          setEmpresa((state) => $u(state, { $set: data }));
          setLoad(false);
        })
        .fail("base.load");
    }
    fetch();
  }, [api]);

  async function onSubmit(data: any) {
    setLoading(true);
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    for (const property in data) {
      formData.append(property, data[property]);
    }
    await ax
      .patch($j("empresa"), formData, headers)
      .then((response) => {
        if (response.status === 200) {
          addToast(caps("success:base.success"), {
            appearance: "success",
            autoDismiss: true,
          });
        }
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(
            caps("errors:base.update", {
              element: localize("errors:elements.company"),
            }),
            {
              appearance: "error",
              autoDismiss: true,
            }
          );
        }
      });
    setLoading(false);
  }
  return (
    <BaseContentView title="titles:perfil_empresa">
      <div className="col-12">
        {isLoad ? (
          <BounceLoader
            css={{ margin: "2.5rem auto" } as any}
            color="var(--primary)"
            size={64}
          />
        ) : (
          <ValidatedForm
            onSubmit={onSubmit}
            validations={{
              nombre_sistema: {
                presence: {
                  allowEmpty: false,
                  message: caps("validations:required"),
                },
              },
              rut: {
                presence: {
                  allowEmpty: false,
                  message: caps("validations:required"),
                },
                format: {
                  pattern: /(\d|\d\.){1,9}-?[0-9kK]/,
                  message: caps("validations:invalid_format"),
                },
              },
              empresa: {
                presence: {
                  allowEmpty: false,
                  message: caps("validations:required"),
                },
              },
              telefono: {
                length: {
                  maximum: 15,
                  message: caps("validations:max_length", { count: 15 }),
                },
              },
              email: {
                format: {
                  pattern:
                    /(^$|(^([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/,
                  message: caps("validations:email"),
                },
              },
              web: {},
              direccion: {
                length: {
                  minimum: 5,
                  tooShort: caps("validations:min_length", { count: 5 }),
                },
              },
            }}
            fields={[
              {
                label: "labels:inputs.logo_sistema",
                type: FILE_INPUT_PREVIEW,
                name: "logo",
                accept: ["jpg", "jpeg", "png"],
                span: 6,
                src: empresa?.logo,
              },
              {
                label: "labels:inputs.img_principal",
                type: FILE_INPUT_PREVIEW,
                name: "imagen_principal",
                accept: ["jpg", "jpeg", "png"],
                span: 6,
                src: empresa?.imagen_principal,
              },
              {
                type: TEXTBOX,
                label: "labels:inputs.nombre_sistema",
                name: "nombre_sistema",
                value: empresa?.nombre_sistema,
                placeholder: "validations:required",
                span: 3,
              },
              {
                type: TEXTBOX,
                label: "labels:inputs.rut",
                name: "rut",
                value: empresa?.rut,
                placeholder: "validations:required",
                span: 3,
                isValidateRut: true,
              },
              {
                type: TEXTBOX,
                label: "labels:inputs.empresa",
                name: "empresa",
                value: empresa?.nombre,
                placeholder: "validations:required",
                span: 6,
              },
              {
                type: TEXTBOX,
                label: "labels:inputs.telefono",
                name: "telefono",
                value: empresa?.telefono,
                placeholder: "validations:required",
                span: 3,
              },
              {
                type: TEXTBOX,
                label: "labels:inputs.email",
                name: "email",
                value: empresa?.email,
                placeholder: "validations:required",
                span: 3,
              },
              {
                type: TEXTBOX,
                label: "labels:inputs.web_corporativa",
                name: "web",
                value: empresa?.web,
                placeholder: "validations:optional",
                span: 3,
              },
              {
                type: TEXTAREA,
                label: "labels:inputs.direccion",
                name: "direccion",
                value: empresa?.direccion,
                placeholder: "validations:required",
                span: 12,
              },
            ]}
          />
        )}
      </div>
    </BaseContentView>
  );
};
