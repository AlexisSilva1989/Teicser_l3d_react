
import React from 'react';
import { Col } from 'react-bootstrap';

export const ShowMessageInModule = (props : {message:string}) => {
    return (
        <Col sm='12' className={'justify-content-center'} style={{'display': 'flex'}}>
            <p>{props.message}</p>
        </Col>
    )
}