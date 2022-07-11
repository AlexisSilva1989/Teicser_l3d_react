import React, { useState } from 'react';
import { BaseContentView } from '../../Common/BaseContentView';
import { Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { $u, $j, $d, $m } from '../../../Common/Utils/Reimports';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useReload } from '../../../Common/Hooks/useReload';
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { Equipo } from '../../../Data/Models/Equipo/Equipo';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { SearchBar } from '../../../Components/Forms/SearchBar';

export interface reportePdf {
  equipo?: Equipo
  fecha: string
  pdf: string
  pdf_name: string
  idEquipo: string
}

interface IErrorReportePdf {
  equipo: string[] | undefined
  fecha: string[] | undefined
  pdf: string[] | undefined
}

interface IDataFilters {
  filterByEquipo: string | undefined
}

const inicialreportePdf = {
  idEquipo: "",
  fecha: "",
  pdf: "",
  pdf_name: ""
}

const inicialErrosreportePdf = {
  equipo: [],
  fecha: [],
  pdf: [],
}

export const PdfColumns: LocalizedColumnsCallback<reportePdf> = () => [
  { name: 'Equipo', selector: pdf => pdf.equipo?.nombre , width: '20%'},
  { name: 'Fecha', selector: pdf => $m(pdf.fecha).format('DD-MM-YYYY'), width: '20%' },
  { name: 'Nombre', selector: pdf => pdf.pdf_name , width: '50%'}
];

export const IndexReportsPdf = () => {

  //hooks
  const { addToast } = useToasts();
  const { intl, capitalize: caps } = useFullIntl();
  const { setLoading } = useDashboard();
  const api = useApi();
  const [reloadTable, doReloadTable] = useReload();

  //states
  const [display, setDisplay] = useState<string>();
  const [reportePdf, setPeportePdf] = useState<reportePdf>(inicialreportePdf);
  const [errorsReportePdf, setErrorsReportePdf] = useState<IErrorReportePdf>(inicialErrosreportePdf);
  const [filtersParams, setFiltersParams] = useState<IDataFilters>({
    filterByEquipo: undefined
  })
  const [search, doSearch] = useSearch();


  const pdfDescargar = (pdf: any) => {
    setLoading(true);
    api.get<string | Blob | File>($j('descargar_pdf', pdf.ruta.toString()), { responseType: 'blob' })
      .success(e => {
        $d(e, pdf.pdf_name);
        addToast(caps('success:base.success'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .fail('Error al intentar descargar el archivo')
      .finally(() => {
        setLoading(false);
      });
  }

  const pdfEliminar = async (img: any) => {
    setLoading(true);
    api.get<any>($j('delete_pdf', img.id.toString())).success(e => {
      doReloadTable()
      addToast(caps('success:base.success'), {
        appearance: 'success',
        autoDismiss: true,
      });
    })
      .fail('Error al eliminar el archivo')
      .finally(() => {
        setLoading(false);
      });
  }

  const colums = PdfColumns(intl)

  colums.push({
    name: 'Opción',
    center: true,
    width: '10%',
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
            <i className='fas fas fa-file-pdf' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => pdfDescargar(pdf)} />
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
            <i className='fas fas fa-trash-alt' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => pdfEliminar(pdf)} />
          </OverlayTrigger>
        </Col>

      </>
    )
  });

  const onClickEnviar = async () => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    if (onSendValidate() > 0) {
      return;
    }

    formData.append("idEquipo", reportePdf.idEquipo);
    formData.append("file", reportePdf.pdf);
    formData.append("fecha", reportePdf.fecha);


    setLoading(true);
    await ax.patch('pdf_save', formData, headers)
      .then((response) => {
        doReloadTable()
        addToast(caps('success:base.success'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onSendValidate() {
    var cantError = 0;
    setErrorsReportePdf(() => inicialErrosreportePdf);
    if (reportePdf.idEquipo === undefined || reportePdf.idEquipo === "") {
      setErrorsReportePdf((s) => $u(s, { equipo: { $push: ["Por favor, seleccione un equipo"] } }));
      cantError++;
    }
    if (reportePdf.fecha === undefined || reportePdf.fecha === "") {
      setErrorsReportePdf((s) => $u(s, { fecha: { $push: ["Por favor, seleccione una fecha"] } }));
      cantError++;
    }
    if (reportePdf.pdf === undefined || reportePdf.pdf === null || reportePdf.pdf === "") {
      console.log('Por favor, cargue un archivo pdf: ');
      setErrorsReportePdf((s) => $u(s, { pdf: { $push: ["Por favor, cargue un archivo pdf"] } }));
      cantError++;
    }

    // if (!condArticulos) {
    // 	setErrors((s) =>$u(s, {	odc: {	$push: [validation('odc_items_required')]}}));
    // 	cantError++;		
    // }

    // if(!condCantidadArticulos){
    // 	setErrors((s) => $u(s, { odc: { $push: [validation('odc_items_quantity_SODC')]}}));
    // 	cantError++;
    // }
    // if (!condFecha){
    // 	setErrors((s) => $u(s, {fecha_solicitud: {$push: [
    // 		caps('validations:required', {
    // 			field: localize('labels:inputs.request_date')
    // 		})]}}));
    // 	inputs = inputs.filter((x) => x !== 'fecha_solicitud');
    // 	cantError++;
    // }

    // if (condFecha && !condFechaEntrega){
    // 	setErrors((s) => $u(s, {fecha_entrega: {$push: [validation('odc_request_date')]}}));
    // 	inputs = inputs.filter((x) => x !== 'fecha_entrega');
    // 	cantError++;
    // }
    return cantError;
  }

  const handleChangeFile = async (fileData: any) => {
    setPeportePdf(state => $u(state, {
      pdf: { $set: fileData }
    }))
  }

  const handleChangeDisplay = (display: string | undefined) => {
    setDisplay(state => $u(state, { $set: display }));
  }

  return (
    <>
      <BaseContentView title='titles:import_pdf'>
        <Col sm={3}>
          <ApiSelect<Equipo>
            name='equipo_select'
            placeholder='Seleccione Equipo'
            source={'service_render/equipos'}
            label={'Equipo'}
            selector={(option) => {
              return { label: option.nombre, value: option.id.toString() };
            }}
            onChange={(value) => {
              setPeportePdf(state => $u(state, {
                idEquipo: { $set: value }
              }))
            }}
            errors={errorsReportePdf.equipo}
          />
        </Col>
        <Col sm={3}>
          <Datepicker
            label='Fecha de PDF'
            value={reportePdf.fecha}
            onChange={value => {
              setPeportePdf(state => $u(state, {
                fecha: { $set: value }
              }))
            }}
            errors={errorsReportePdf.fecha}
          />
        </Col>
        <Col sm={3}>
          <FileInputWithDescription
            id={"inputFile"}
            name={"inputFile"}
            label="Seleccionar PDF"
            onChange={handleChangeFile}
            onChangeDisplay={handleChangeDisplay}
            display={display}
            accept={["pdf"]}
            errors={errorsReportePdf.pdf}
          />
        </Col>
        <Col sm={3} className="d-flex justify-content-end align-items-end mb-3">
          <Button onClick={onClickEnviar}>
            Guardar
          </Button>
        </Col>
        <Col sm={12} className="mt-2">
          <hr />
        </Col>
        <Col sm={12} className="d-flex justify-content-end align-items-end pr-0 pl-0">
          <Col sm={3}>
            <ApiSelect<Equipo>
              name='equipo_select'
              placeholder='Seleccione'
              source={'service_render/equipos'}
              label={'Equipo'}
              value={filtersParams.filterByEquipo == undefined ? '-1' : filtersParams.filterByEquipo}
              firtsOptions={{ label: 'TODOS', value: '-1' }}
              selector={(option) => {
                return { label: option.nombre, value: option.id.toString() };
              }}
              onChange={(data) => {
                setFiltersParams(state => $u(state, { filterByEquipo: { $set: data != '-1' ? data : undefined } }))
              }}
            />
          </Col>

          <div className="col-lg-3 col-md-5 col-sm-6" style={{ verticalAlign: 'bottom' }}>
            <SearchBar onChange={doSearch} />
          </div>
        </Col>

        <Col sm={12} className="mt-3">
          <ApiTable<reportePdf>
            columns={colums}
            source={"index_pdf"}
            reload={reloadTable}
            paginationServe={true}
            filterServeParams={filtersParams}
            search={search}
          />
        </Col>

      </BaseContentView>
    </>
  );
};
