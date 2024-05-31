import React, { useCallback } from "react";
import "./../../Assets/scss/style.scss";
import { useDispatch } from "react-redux";
import { login } from "../../Store/Dashboard/DashboardActionCreators";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import {
  ValidatedForm,
  TEXTBOX,
  PASSWORD,
} from "../../Components/Forms/ValidatedForm";
import md5 from "md5";
import { BaseLoginComponent } from "./BaseLoginComponent";
import { Link } from "react-router-dom";

export const Login = () => {
  const { capitalize: caps } = useFullIntl();
  const dispatch = useDispatch();
  const doLogin = useCallback(
    (user: string, password: string) => dispatch(login(user, password)),
    [dispatch]
  );

  function onSubmit(e: { nombre_usuario: string; clave: string }) {
    doLogin(e.nombre_usuario, md5(e.clave));
  }

  return (
    <BaseLoginComponent>
      <ValidatedForm
        submitIcon=""
        submitLabel="labels:links.login"
        onSubmit={onSubmit}
        validations={{
          nombre_usuario: {
            presence: {
              allowEmpty: false,
              message: caps("validations:required", {
                field: caps("labels:inputs.username"),
              }),
            },
          },
          clave: {
            presence: {
              allowEmpty: false,
              message: caps("validations:required", {
                field: caps("labels:inputs.password"),
              }),
            },
          },
        }}
        fields={[
          {
            type: TEXTBOX,
            name: "nombre_usuario",
            placeholder: "labels:inputs.user_or_email",
          },
          {
            type: PASSWORD,
            name: "clave",
            placeholder: "labels:inputs.password",
          },
        ]}
      />
      <Link to="/restablecer_contraseña">
        {caps("labels:links.forgot_my_password")}
      </Link>
    </BaseLoginComponent>
  );
};
