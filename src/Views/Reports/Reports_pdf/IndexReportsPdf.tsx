import React, { useState } from 'react';
import { BaseContentView } from '../../Common/BaseContentView';
import { Col, Button,  Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { $u, $j, $d } from '../../../Common/Utils/Reimports';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useReload } from '../../../Common/Hooks/useReload';
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { ApiTable } from '../../../Components/Api/ApiTable';

export interface reportePdf {
    fecha: string;
    pdf: string;
	pdf_name: string;

}

const inicialreportePdf = {
	fecha: "",
	pdf: "",
	pdf_name: ""
}

const PdfColumns : LocalizedColumnsCallback<reportePdf> = () => [
	{ name: 'Fecha', selector: pdf => pdf.fecha},
	{ name: 'Nombre', selector: pdf => pdf.pdf_name}
];

export const IndexReportsPdf = () => {

	const [display, setDisplay] = useState<string>();
	const [reportePdf, setPeportePdf] = useState<reportePdf>(inicialreportePdf);
	const { addToast } = useToasts();
	const { intl, capitalize: caps, localize } = useFullIntl();

	const { setLoading } = useDashboard();
	const api = useApi();
	const [reloadTable, doReloadTable] = useReload();


	const pdfDescargar = (pdf : any) => {
		setLoading(true);
		api.get< string | Blob | File>($j('descargar_pdf', pdf.ruta.toString()), { responseType: 'blob' }).success(e => {
		  $d(e, pdf.pdf_name);
		  setLoading(false);
		  addToast(caps('success:base.success'), {
					appearance: 'success',
					autoDismiss: true,
				});
			}).fail('base.post');
	}

	const pdfEliminar  = async (img: any) => {
		setLoading(true);
		api.get<any>($j('delete_pdf', img.id.toString())).success(e => {
			setLoading(false);
			doReloadTable()
			addToast(caps('success:base.success'), {
					  appearance: 'success',
					  autoDismiss: true,
			});
		}).fail('base.post');
	}

	const colums = PdfColumns(intl)

	colums.push({  
		name: 'Opción', 
		center: true,
		width: '90px',
		cell: pdf => (
			<>
			<Col sm={6}>
				<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip id={`tooltip-1`}>
								descargar
							</Tooltip>
						}
						>
						<i className='fas fas fa-file-pdf' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => pdfDescargar(pdf)}/> 
				</OverlayTrigger>
			</Col>

			<Col sm={6}>
				<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip id={`tooltip-1`}>
								Eliminar
							</Tooltip>
						}
						>
						<i className='fas fas fa-trash-alt' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => pdfEliminar(pdf)}/> 
				</OverlayTrigger>
			</Col>

			</>
		)
	});
	
	const onClickEnviar  = async () => {
		const formData = new FormData();
		const headers =  { headers: { "Content-Type": "multipart/form-data" } };

		formData.append("file", reportePdf.pdf);
		formData.append("fecha", reportePdf.fecha);

		setLoading(true);
		await ax.patch('pdf_save', formData, headers)
			.then((response) => {
				doReloadTable()
				setLoading(false);
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
			<Col sm={2} className="d-flex justify-content-end align-items-end">
				<Button onClick={onClickEnviar}>
					Guardar
				</Button>
			</Col>

			<hr/>

			<Col sm={12} className="mt-5">
				<ApiTable<reportePdf>
					columns={colums}
					source={"index_pdf"} 
					reload={reloadTable}
				/>
			</Col>

		</BaseContentView>
		</>
	);
};
