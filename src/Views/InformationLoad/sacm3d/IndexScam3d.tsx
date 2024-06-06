import React, { useState } from 'react';
import { Col, Button } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { $u, $j, $d, $m } from '../../../Common/Utils/Reimports';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useToasts } from 'react-toast-notifications';
import { Controller, useForm, ErrorMessage  } from 'react-hook-form';
import { ApiSelect } from '../../../Components/Api/ApiSelect';

interface IDataForm { measurementFile: any, measurementDate: string , equipo_select: string}

export const IndexScam3d = () => {
	const api = useApi();

	const [display, setDisplay] = useState<string>();

	const { setLoading } = useDashboard();
	const { addToast } = useToasts();
	const { capitalize: caps } = useFullIntl();


	const onSubmit = async (data: IDataForm) => {
		const formData = new FormData();
		const headers = { headers: { "Content-Type": "multipart/form-data" } };

		formData.append("measurementFile", data.measurementFile);
		formData.append("measurementDate", data.measurementDate);
		formData.append("equipoId", data.equipo_select);

		setLoading(true);
		await ax.patch('service_render/upload_file_medicion_var', formData, headers)
			.then((response) => {
				addToast(caps('success:base.success'), {
					appearance: 'success',
					autoDismiss: true,
				});
			})
			.catch((e: AxiosError) => {
				if (e.response) {
					addToast(caps('Ha ocurrido un error'), {
						appearance: 'error',
						autoDismiss: true,
					});
				}
			})
			.finally(() => { setLoading(false) })
			;
	}

	const { handleSubmit, register, errors, control, setValue } = useForm<IDataForm>({
		mode: "onSubmit",
		defaultValues:{
			measurementDate : $m().format('DD-MM-YYYY')
		}
	});

	const descargarEjemplo = async () => {
		setLoading(true);
		await api.get<string | Blob | File>($j('scam_descargar'), { responseType: 'blob' }).success(e => {
			$d(e, 'scan_3d_ejemplo.csv');
			setLoading(false);
			addToast(caps('success:base.success'), {
				appearance: 'success',
				autoDismiss: true,
			});
		}).fail('base.post');
	}

	return (<BaseContentView title='titles:scam_3d'>
		<Col sm={9}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Col sm={3}>
					<Controller control={control}
						id={"measurementFile"}
						name={"measurementFile"}
						onChangeDisplay={(display: string | undefined) => {
							setDisplay(state => $u(state, { $set: display }));
						}}
						display={display}
						accept={["csv"]}
						rules={{ required: { value: true, message: 'Complete este campo' } }}
						as={FileInputWithDescription}
					/>

					<ErrorMessage errors={errors} name="measurementFile">
						{({ message }) => <small className='text-danger'>{message}</small>}
					</ErrorMessage>
				</Col>
				<Col sm={3}>
					<Controller control={control}
						name='equipo_select'
						placeholder='Seleccione Equipo'
						source={'service_render/equipos'}
						selector={(option: any) => {
							return { label: option.nombre, value: option.id.toString() };
						}}
						as={ApiSelect}
					/>

					<ErrorMessage errors={errors} name="measurementFile">
						{({ message }) => <small className='text-danger'>{message}</small>}
					</ErrorMessage>
				</Col>
				<Col sm={3}>
					<Controller control={control}
						name="measurementDate"
						// onChange={handleChangeDate}
						rules={{ required: { value: true, message: 'Complete este campo' } }}
						as={Datepicker}
					/>
					<ErrorMessage errors={errors} name="measurementDate">
						{({ message }) => <small className='text-danger'>{message}</small>}
					</ErrorMessage>
				</Col>

				<Col sm={3} >
					<Button type={"submit"} className='btn-primary mr-3'>
						Guardar
					</Button>
				</Col>
			</form>
		</Col>
		<Col sm={3} className='text-right' >
			<Button variant="outline-primary" className='btn-outline-primary' onClick={descargarEjemplo} >
				Descargar ejemplo
			</Button>
		</Col>
	</BaseContentView>);
};
