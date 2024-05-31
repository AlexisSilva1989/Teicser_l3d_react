import React, { useEffect } from "react";
import { Col } from "react-bootstrap";

export const ShowMessageInModule = ({
  message,
  className,
}: {
  message: string | string[];
  className?: string;
}) => {
  const getMessages = () => {
    const errors: JSX.Element[] = [];
    Array.isArray(message)
      ? message.forEach((msg: string) => {
          errors.push(
            <>
              {msg}
              <br />
            </>
          );
        })
      : errors.push(<>{message}</>);
    return errors;
  };

  return (
    <Col className={`alert alert-warning mt-3 text-center ${className}`}>
      <i className="fa fa-exclamation-triangle fa-4x m-3" aria-hidden="true" />
      <p style={{ textAlign: "center" }}> {getMessages()} </p>
    </Col>
  );
};
