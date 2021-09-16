import React, { useState, useCallback } from 'react';
import { BaseContentView } from '../../Common/BaseContentView';
import { Col, Button, Row, Modal } from 'react-bootstrap';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { $u, $j, $d } from '../../../Common/Utils/Reimports';
import { FileSelect } from '../../../Components/Forms/FileSelect';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';

export interface reportePdf {
    fecha: string;
    pdf: string;
}

const inicialreportePdf = {
	fecha: "",
	pdf: "",
}



export const IndexReportsPdf = () => {

	const [display, setDisplay] = useState<string>();
	const [reportePdf, setPeportePdf] = useState<reportePdf>(inicialreportePdf);
	const { addToast } = useToasts();
	const { intl, capitalize: caps, localize } = useFullIntl();


	function setPostFotosPerifericas(e: any | null) {
		setPeportePdf((s) => $u(s, { pdf: { $set: e ?? undefined } }));
	}
	
	const onClickEnviar  = async () => {
		const formData = new FormData();
		const headers =  { headers: { "Content-Type": "multipart/form-data" } };

		formData.append("file", reportePdf.pdf);
		formData.append("fecha", reportePdf.fecha);


		await ax.patch('pdf_save', formData, headers)
			.then((response) => {
				addToast(caps('success:base.success'), {
					appearance: 'success',
					autoDismiss: true,
				});	
			})
			.catch((e: AxiosError) => {
				if (e.response) {

				}
			}
		);
	}

	const handleChangeFile = async (fileData: any) => {
		setPeportePdf( state => $u( state, { 
			pdf: { $set: fileData }
		}))
	}

    const handleChangeDisplay = (display: string | undefined) => {
		setDisplay(state => $u(state, { $set: display } ));
	}

	return (
		<>
		<BaseContentView title='titles:import_pdf'>
			<Col sm={4}>
				<Datepicker 
					label='Fecha de PDF' 
					value={reportePdf.fecha}
					onChange={ value => {
						setPeportePdf( state => $u( state, { 
							fecha: { $set: value }
						}))
					} }


				/>					
			</Col>
			<Col sm={6}>
				<FileInputWithDescription 
					id={"inputFile"}
					label="Seleccionar PDF"
					onChange={ handleChangeFile }
					onChangeDisplay={ handleChangeDisplay }
					display={display}
					accept={["pdf"]}
				/>
			</Col>
			<Col sm={2}>
				<Button className='d-flex justify-content-start btn-primary mr-3 mt-4' onClick={onClickEnviar}>
					Guardar
				</Button>
			</Col>
		</BaseContentView>
		</>
	);
};
