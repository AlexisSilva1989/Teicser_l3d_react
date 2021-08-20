import React, { useState, useCallback } from 'react';
import { Col, Button, Card, Tooltip } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { useLocalization } from '../../../Common/Hooks/useLocalization';
import { Textbox } from '../../../Components/Input/Textbox';
import { RadioSelect } from '.././../../Components/Forms/RadioSelect';
import { TextArea } from '../../../Components/Forms/TextArea';

export const IndexMeasurement = () => {
	const { input, title } = useLocalization();


	return (
		<>
		<BaseContentView title='titles:measurement'>
		<Col sm={12}>
				<Card className='bg-dark text-light'>
					<Card.Body>
						<Col sm={3}>
							Equipo:  Molinos SAG 1011
						</Col>	
						<Col sm={3}>
							Fecha de última medición 31 de mayo de 2021			
						</Col>	
						<Col sm={3}>
							Desgaste promedio de medición realizada 30/06/2021			
						</Col>	
						<Col sm={3}>
							Fecha de última medición 30/06/2021
						</Col>	
					</Card.Body>
				</Card>
			</Col>
			<Col sm={12}>		
				<div style={{width: "48%", margin: "auto"}}>
					<Card className='bg-dark text-light'>
						<Card.Body>
							<img src="http://localhost:8000/grafico_prueba.jpg" alt="" />
						</Card.Body>
					</Card>
				</div>
			</Col>
			<Col sm={2} className="offset-10">
				<Button className='d-flex justify-content-start btn-primary mr-3 mt-5'>
					Proyección de datos operacionales
				</Button>
			</Col>
		</BaseContentView>
		</>
	);
};
