import React, { useState, useRef } from 'react';
import { Col, Button, Row, Modal } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { CustomSelect } from '../../../Components/Forms/CustomSelect';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { useLocalization } from '../../../Common/Hooks/useLocalization';
import { Textbox } from '../../../Components/Input/Textbox';
import { RadioSelect } from '.././../../Components/Forms/RadioSelect';
import { TextArea } from '../../../Components/Forms/TextArea';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { FileUtils } from './../../../Common/Utils/FileUtils';
import { $u, $j, $d } from '../../../Common/Utils/Reimports';
import moment from 'moment';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { SearchBar } from '../../../Components/Forms/SearchBar';
import { BounceLoader } from 'react-spinners';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { useReload } from '../../../Common/Hooks/useReload';
import { ColumnsPipe } from '../../../Common/Utils/LocalizedColumnsCallback';
import { useLocalizedColumns } from '../../../Common/Hooks/useColumns';
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';


export interface OperationalDataImport {
    X_Y: string;
}

// const OperationalColumns : LocalizedColumnsCallback<OperationalDataImport> = () => [
// 	{ name: 'X , Y', selector: operation => operation.X_Y}
// ];

export const IndexScam3d = () => {

	const [file, setFile] = useState<any>();
	const [display, setDisplay] = useState<string>();

	const handleChangeFile = async (fileData: any) => {
		setFile(fileData)
	}

    const handleChangeDisplay = (display: string | undefined) => {
		setDisplay(state => $u(state, { $set: display } ));
	}

	const onClickEnviar  = async () => {
		const formData = new FormData();
		const headers =  { headers: { "Content-Type": "multipart/form-data" } };

		formData.append("file", file);

		await ax.patch('excel_xy', formData, headers)
			.then((response) => {

			})
			.catch((e: AxiosError) => {
				if (e.response) {

				}
			}
		);
	}

	return (
		<>

	<BaseContentView title='titles:operational_data'>
			<Col sm={3}>
                <FileInputWithDescription 
					id={"inputFile"}
					onChange={ handleChangeFile }
					onChangeDisplay={ handleChangeDisplay }
					display={display}
					accept={["xls", "xlsx"]}
				/>
			</Col>
			<Col sm={2}>
				<Button className='d-flex justify-content-start btn-primary mr-3' onClick={onClickEnviar}>
					guardar
				</Button>
			</Col>

			{/* <Col sm={3} className="offset-6">
				<SearchBar onChange={doSearch} />
			</Col> */}
			{/* <Col sm={12}>
			{loadingg ? (
					<BounceLoader css={{ margin: '2.25rem auto' } as any} color='var(--primary)' />
				) : (
				<ApiTable<OperationalDataImport> 
					columns={OperationalColumns(intl)} 
					source={operationalData ?? []} 
					search={search}
					// onSelect={e => goto.relative('meta.details', { cotizacion: e })}
					reload={ reloadTable }
					/>
				)}
			</Col> */}

		</BaseContentView>		

		</>
	);
};
