import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { AgregarBase } from "../Common/AgregarBase";
import React from "react";
import {
  TEXTBOX,
  SELECT,
  PASSWORD,
} from "../../Components/Forms/ValidatedForm";
import { $j } from "../../Common/Utils/Reimports";
import { Rol } from "../../Data/Models/Configuracion/Rol";
import md5 from "md5";

interface TRaw {
  nombre_usuario: string;
  nombre: string;
  clave?: string;
  rol: string;
}

interface TData {
  nombre_usuario: string;
  nombre: string;
  clave?: string;
  trabajador?: number | null;
  rol?: string;
}

export const AgregarUsuario = () => {
  const { capitalize: caps } = useFullIntl();

  function onSerialize(e: TRaw): TData {
    return {
      ...e,
      rol: e.rol === "-1" ? undefined : e.rol,
      clave: e.clave != null ? md5(e.clave) : undefined,
    };
  }

  return (
    <AgregarBase<TRaw, TData>
      title="titles:add_user"
      path={$j("usuarios")}
      errorElement="errors:elements.user"
      onSerialize={onSerialize}
      validations={{
        nombre_usuario: {
          presence: {
            allowEmpty: false,
            message: caps("validations:required"),
          },
          length: {
            minimum: 3,
            tooShort: caps("validations:min_length", { count: 3 }),
          },
          format: {
            pattern: "[a-z0-9]+",
            flags: "i",
            message: caps("validations:invalid_format_space"),
          },
        },
        nombre: {
          presence: {
            allowEmpty: false,
            message: caps("validations:required"),
          },
          length: {
            minimum: 3,
            tooShort: caps("validations:min_length", { count: 3 }),
          },
        },
        primer_apellido: {
          presence: {
            allowEmpty: false,
            message: caps("validations:required"),
          },
          length: {
            minimum: 3,
            tooShort: caps("validations:min_length", { count: 3 }),
          },
        },
        segundo_apellido: function (
          value: any,
          attributes: any,
          attributeName: any,
          options: any,
          constraints: any
        ) {
          if (attributes.segundo_apellido == "") {
            return null;
          }
          return {
            length: {
              minimum: 3,
              tooShort: caps("validations:min_length", { count: 3 }),
            },
          };
        },
        email: {
          presence: {
            allowEmpty: false,
            message: caps("validations:required"),
          },
          email: {
            message: caps("validations:email"),
          },
        },
        clave: function (
          value: any,
          attributes: any,
          attributeName: any,
          options: any,
          constraints: any
        ) {
          if (attributes.clave == "") {
            return null;
          }
          return {
            length: {
              minimum: 8,
              tooShort: caps("validations:min_length", { count: 8 }),
            },
          };
        },
        rol: {
          presence: {
            allowEmpty: false,
            message: caps("validations:required"),
          },
        },
      }}
      fields={[
        {
          type: TEXTBOX,
          label: "labels:inputs.name",
          name: "nombre",
          placeholder: caps("validations:min_length", { count: 3 }),
          span: 4,
        },
        {
          type: TEXTBOX,
          label: "labels:inputs.lastname",
          name: "primer_apellido",
          placeholder: caps("validations:min_length", { count: 3 }),
          span: 4,
        },
        {
          type: TEXTBOX,
          label: "labels:inputs.second_lastname",
          name: "segundo_apellido",
          placeholder: "validations:optional",
          span: 4,
        },
        {
          type: TEXTBOX,
          label: "labels:inputs.email",
          name: "email",
          placeholder: "validations:email",
          span: 4,
        },
        {
          type: TEXTBOX,
          label: "labels:inputs.username",
          name: "nombre_usuario",
          placeholder: "validations:required",
          span: 4,
        },
        {
          type: PASSWORD,
          label: "labels:inputs.password",
          name: "clave",
          placeholder: "validations:required",
          span: 4,
        },
        {
          type: SELECT,
          label: "labels:inputs.role",
          name: "rol",
          span: 4,
          source: $j("roles"),
          selectDisplay: (x: Rol) => x.nombre,
          selectValue: (x: Rol) => x.codigo.toString(),
        },
      ]}
    />
  );
};
