
import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';

export const ShowMessageInModule = ({message} : {message:string | string[]}) => {

    const getMessages = ()=>{
        const errors : JSX.Element[] = [];
            Array.isArray(message) 
                ? message.forEach((msg:string) => {
                    errors.push(<>{msg}<br/></>)
                })
                :  errors.push(<>{message}</>)
        return errors;
    };

    return (
        <Col sm='12' className={'justify-content-center'} style={{'display': 'flex'}}>
            <p style={{'textAlign': 'center'}}> {getMessages() } </p>
        </Col>
    )
}