import { PropsWithChildren } from 'react';
import React from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { Row, Col } from 'react-bootstrap';

interface Props {
  asDiv?: boolean
  title?: string
}

export const BaseContentView = (props: PropsWithChildren<Props>) => {
  const { capitalize: caps } = useFullIntl();

  if (props.asDiv) {
    return (<div
      className={`container-fluid `}
      style={{ height: '93vh' }}
    >
      {props.title && (
        <Col sm={12} className="mb-4 pt-3">
          <h3>{caps(props.title)}</h3>
        </Col>
      )}
      {props.children}
    </div>)
  }


  return (
    <Row className='p-3 bg-white'>
      {props.title && (
        <Col sm={12} className='mb-4'>
          <h3>{caps(props.title)}</h3>
        </Col>
      )}
      {props.children}
    </Row>
  );
};


