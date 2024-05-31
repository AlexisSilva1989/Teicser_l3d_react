import React, { PropsWithChildren } from "react";
import "./../../Assets/scss/style.scss";
import { Col, Row, Container } from "react-bootstrap";
import { useEmpresa } from "../../Common/Hooks/useEmpresa";

interface Props {
  tittle?: string;
}
export const BaseLoginComponent = (props: PropsWithChildren<Props>) => {
  const datosEmpresa = useEmpresa();

  return (
    <Container fluid className="login">
      <Row>
        <Col
          sm={12}
          lg={3}
          style={{ height: "100vh", float: "left" }}
          className="p-4 bg-dark text-light login-form"
        >
          <div className="text-center">
            <span className="h2" style={{ lineHeight: "60px" }}>
              <span
                className="ml-3 login-brand"
                style={{ fontFamily: "helvetica", textTransform: "uppercase" }}
              >
                {datosEmpresa.nombre_sistema}
              </span>
            </span>
          </div>

          <div className="text-center">
            <span className="h2" style={{ lineHeight: "60px" }}>
              {datosEmpresa.logo && (
                <img
                  id="main-logo"
                  src={datosEmpresa.logo}
                  alt=""
                  className="logo"
                />
              )}
            </span>
          </div>
          <div style={{ marginTop: "200px" }}>
            {props.tittle && <span>{props.tittle}</span>}
            {props.children}
          </div>
        </Col>

        <Col
          lg={9}
          className="d-sm-none d-lg-block login-image"
          style={{
            backgroundImage: `url(${datosEmpresa.imagen_principal})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            float: "left",
          }}
        />
      </Row>
    </Container>
  );
};
