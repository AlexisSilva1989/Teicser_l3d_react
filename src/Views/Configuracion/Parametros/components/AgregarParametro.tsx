import React from 'react';
import { useLocalization } from '../../../../Common/Hooks/useLocalization';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface Props {
	visible: boolean
	hide: () => void
	onSubmit: (datos: Record<'nombre'|'valor'|'descripcion', string>) => void
}

const schema = (msg: (value: string, args?: any) => string) => yup.object().shape({
	nombre: yup.string()
		.required(msg('required'))
		.min(1, msg('min_length', { length: 1 })),
	descripcion: yup.string()
		.required(msg('required'))
		.min(1, msg('min_length', { length: 1 })),
	valor: yup.string()
		.required(msg('required'))
		.min(1, msg('min_length', { length: 1 })),
});

export const AgregarParametro = (props:Props) => {
	const { visible, hide, onSubmit } = props;
	const { title, label, validation } = useLocalization();
	const { handleSubmit, register, errors } = useForm({ validationSchema: schema(validation) });


	const Costonchange = () => {
		console.log("Aquii")
	}

	return <Modal show={visible} onHide={hide}>
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Modal.Header closeButton>
				<b>{title('create_parameter')}</b>
			</Modal.Header>
			<Modal.Body>
				<Form.Group>
					<Form.Label><b>{label('name')}:</b></Form.Label>
					<Form.Control type='text' name='nombre' ref={register} onChange={Costonchange}/>
					{errors.nombre && <span className='text-danger'>{errors.nombre.message}</span>}
				</Form.Group>
				<Form.Group>
					<Form.Label><b>{label('description')}:</b></Form.Label>
					<Form.Control type='text' name='descripcion' ref={register}/>
					{errors.descripcion && <span className='text-danger'>{errors.descripcion.message}</span>}
				</Form.Group>
				<Form.Group>
					<Form.Label><b>{label('value')}:</b></Form.Label>
					<Form.Control type='text' name='valor' ref={register}/>
					{errors.valor && <span className='text-danger'>{errors.valor.message}</span>}
				</Form.Group>
			</Modal.Body>
			<Modal.Footer className='text-right'>
				<Button variant='primary' type='submit'>
					<i className='fas fa-save mr-3' />
					{label('save_changes')}
				</Button>
			</Modal.Footer>
		</Form>
	</Modal>;
};