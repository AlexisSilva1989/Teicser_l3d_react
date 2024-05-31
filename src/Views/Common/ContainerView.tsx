import { PropsWithChildren } from "react";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { useLocalization } from "../../Common/Hooks/useLocalization";

interface Props {
  title?: string;
  subTitle?: string;
}

export const ContainerView = (props: PropsWithChildren<Props>) => {
  const { title } = useLocalization();
  return (
    <Row className="p-3 bg-white">
      {props.title && (
        <Col sm={12} className="mb-4">
          <h3>
            {title(props.title)} {props.subTitle ? props.subTitle : ""}
          </h3>
        </Col>
      )}
      {props.children}
    </Row>
  );
};
