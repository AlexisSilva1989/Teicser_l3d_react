import React, { useState, useCallback } from 'react';
import { Col, Button, Card, Tooltip } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { useLocalization } from '../../../Common/Hooks/useLocalization';
import { Textbox } from '../../../Components/Input/Textbox';
import { RadioSelect } from '.././../../Components/Forms/RadioSelect';
import { TextArea } from '../../../Components/Forms/TextArea';

export const IndexProjection = () => {
	const { input, title } = useLocalization();

    const options = [
		{
			label: "Numérico",
			value: "1"
		},
		{
			label: "Porcentual",
			value: "0"
		}
	]

	return (
		<>
		<BaseContentView title='titles:projection_variable'>
			<Col sm={6} className='text-left mb-2'>
				<h4>
					Periodo a considerar para la proyección de desgaste
				</h4>		
			</Col>
			<Col sm={6} className='text-center mb-2'>
				<h5>
					Fecha de última medición 30/06/2021
				</h5>		
			</Col>
			<Col sm={2} className='text-left mb-2'>
				<CustomSelect
					label="variable de proyección"
					options={[{
						label: 'labels:all',
						value: '-1'
					},
					{
						label: 'labels:active',
						value: '1'
					},
					{
						label: 'labels:inactive',
						value: '0'
					}]}
				/>
			</Col>
			<Col sm={2} className='text-left mb-2'>
				<label><b>{input('date_project')}:</b></label>
			    <Datepicker 
                    name={'start_date'}/>
			</Col>
			<Col sm={2} className='text-left mb-2'>
				<Textbox name='days_project'/>
			</Col>
			<Col sm={6} className='text-left mb-2'>
			</Col>

			<Col sm={6}>
				<Card>
					<Card.Body>
						<Col sm={6}>
							<h4>
								{title("variable_simulation")}
							</h4>
						</Col>
						<Col sm={6}>
							<RadioSelect
								style={{ display: "inline" }}
								name='estatus'
								options={options}
							/>
						</Col>
						<hr/>
						<Col sm={4}>
							Tonelaje a procesado
						</Col>
						<Col sm={4}>
							<Textbox/>
						</Col>
						<Col sm={4}>
							<strong>
								118.000 Ton/día
							</strong>	
						</Col>
						<hr/>
						<Col sm={4}>
							Velocidad						
						</Col>
						<Col sm={4}>
							<Textbox/>
						</Col>
						<Col sm={4}>
							<strong>
								8,67 RPM
							</strong>						
						</Col>
						<hr/>
						<Col sm={4}>
							Dureza DWI						
						</Col>
						<Col sm={4}>
							<Textbox/>
						</Col>
						<Col sm={4}>
							<strong>
								5.90 DWI
							</strong>						
						</Col>
						<hr/>
						<Col sm={4}>
							Carguío Bolas						
						</Col>
						<Col sm={4}>
							<Textbox/>
						</Col>
						<Col sm={4}>
							<strong>
								33,96 Ton/día
							</strong>						
						</Col>
					</Card.Body>
				</Card>
			</Col>

			<Col sm={6}>
				<Card style={{ height: "90%"}}>
					<Card.Body>
						<Col sm={12}>
							<h4>
								{title("changes_of_senses")}
							</h4>
						</Col>
						<hr/>
						<Col sm={8}>
							Toneladas para cambio de sentido de giro
						</Col>
						<Col sm={4}>
							<Textbox/>
						</Col>
						<hr/>
						<Col sm={12}>
							<TextArea
								rows={5}
								value={"Reverso 31/05/2021 a 10/06/2021 Directo 11/06/2021 a 25/06/2021 "}
							/>						
						</Col>


					</Card.Body>
				</Card>
			</Col>
			<Col sm={2} className="offset-10">
				<Button className='d-flex justify-content-start btn-primary mr-3 mt-5'>
					Simular proyección
				</Button>
			</Col>
		</BaseContentView>		</>
	);
};
