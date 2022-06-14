import React, { useState } from 'react';
import { BaseContentView } from '../../Common/BaseContentView';
import { Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { FileInputWithDescription } from '../../../Components/Forms/FileInputWithDescription';
import { $u, $j, $d } from '../../../Common/Utils/Reimports';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { useReload } from '../../../Common/Hooks/useReload';

export interface reportePdf {
    fecha: string;
    pdf: string;
}

const inicialreportePdf = {
	fecha: "",
	pdf: "",
}


const ImgColumns : LocalizedColumnsCallback<any> = () => [
	{ name: 'Fecha', selector: pdf => pdf.fecha},
	{ name: 'Nombre', selector: pdf => pdf.img_name}
];

export const IndexImagenCondicion = () => {

	const [display, setDisplay] = useState<string>();
	const [reportePdf, setPeportePdf] = useState<reportePdf>(inicialreportePdf);
	const { addToast } = useToasts();
	const { intl, capitalize: caps, localize } = useFullIntl();
	const { setLoading } = useDashboard();
	const api = useApi();
	const [reloadTable, doReloadTable] = useReload();

	const pdfDescargar = (pdf : any) => {
		setLoading(true);
		api.get< string | Blob | File>($j('img_descargar', pdf.ruta.toString()), { responseType: 'blob' }).success(e => {
		  $d(e, pdf.pdf_name);
		  setLoading(false);
		  doReloadTable()
		  addToast(caps('success:base.success'), {
					appearance: 'success',
					autoDismiss: true,
				});
			}).fail('base.post');
	}

	const imgEliminar  = async (img: any) => {
		api.get<any>($j('delete_img', img.id.toString())).success(e => {
			setLoading(false);
			doReloadTable()
			addToast(caps('success:base.success'), {
					  appearance: 'success',
					  autoDismiss: true,
			});
		}).fail('base.post');
	}
	
	const colums = ImgColumns(intl)

	colums.push({  
		name: 'Opción', 
		center: true,
		width: '90px',
		cell: img => (
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
						<i className='fas fas fa-download' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => pdfDescargar(img)}/> 
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
						<i className='fas fas fa-trash-alt' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => imgEliminar(img)}/> 
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
		await ax.post('img_save', formData, headers)
			.then((response) => {
				addToast(caps('success:base.success'), {
					appearance: 'success',
					autoDismiss: true,
				});	
				doReloadTable()
				setLoading(false);
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
		<BaseContentView title='titles:img_condition'>
			<Col sm={4}>
				<Datepicker 
					label='Fecha de imagen' 
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
					label="Seleccionar imagen"
					onChange={ handleChangeFile }
					onChangeDisplay={ handleChangeDisplay }
					display={display}
					accept={["png" , "jpg"]}
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
					reload={reloadTable}
					source={"index_img"} 
				/>
			</Col>
		</BaseContentView>
		</>
	);
};
