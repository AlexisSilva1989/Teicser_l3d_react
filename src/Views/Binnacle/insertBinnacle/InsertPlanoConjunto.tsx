import React, { useEffect, useState } from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { SearchBar } from '../../../Components/Forms/SearchBar';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { IPlanosConjunto, IPlanosConjuntosColumns } from '../../../Data/Models/Binnacle/PlanosConjunto';
import { FileInputWithDescription } from '../../../Components/Forms/FileInputWithDescription';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { useReload } from '../../../Common/Hooks/useReload';
import { useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { AxiosError } from 'axios';
import { JumpLabel } from '../../../Components/Common/JumpLabel';


interface IPlanoConjunto {
  idEquipo: string | undefined
}


const InsertPlanoConjunto = ({
  idEquipo
}: IPlanoConjunto) => {

  const [search, doSearch] = useSearch();
  const { intl, capitalize: caps } = useFullIntl();
  const [reloadTable, doReloadTable] = useReload();
  const { addToast } = useToasts();
  const { setLoading } = useDashboard();
  const modalConfirmarEliminar = useShortModal();

  //states
  const [PdfToDelete, setPdfToDelete] = useState<{ id: string | undefined, name: string | undefined }>(
    { id: undefined, name: undefined }
  );
  const [display, setDisplay] = useState<string>();
  const [reportePdf, setReportePdf] = useState<any>(null);
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined
  }>({
    filterByEquipo: undefined
  })

  //Effects 
  useEffect(() => {
    setFiltersParams(state => $u(state, { filterByEquipo: { $set: idEquipo } }))
  }, [idEquipo])

  const handleChangeFile = async (fileData: any) => {
    setReportePdf(fileData)
  }

  const handleChangeDisplay = (display: string | undefined) => {
    setDisplay(state => $u(state, { $set: display }));
  }

  const onClickEnviar = async () => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("idEquipo", filtersParams.filterByEquipo as string);
    formData.append("file", reportePdf);
    setLoading(true);
    await ax.post('planos_conjunto', formData, headers)
      .then((response) => {
        setDisplay("")
        setReportePdf(null)
        doReloadTable()
        addToast(caps('success:base.success'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const msgError = e.response.data.errors 
          ? e.response.data.errors[Object.keys(e.response.data.errors)[0]] 
          : caps('errors:base.post', { element: "planos de conjunto"})
          addToast(msgError,
            { appearance: 'error', autoDismiss: true }
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const verPDF = async (pdf_name: string) => {
    setLoading(true);
    ax.get<string | Blob | File>($j('planos_conjunto', "ver", pdf_name), { responseType: 'blob' })
      .then(response => {
        const archivoPDF = new Blob([response.data], { type: 'application/pdf' });
        const urlPDF = URL.createObjectURL(archivoPDF);
        window.open(urlPDF);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const deletePdf = async (pdf_name: string, id: string) => {
    modalConfirmarEliminar.show()
    setPdfToDelete({ id, name: pdf_name })
  }

  const onConfirmEliminar = async () => {
    modalConfirmarEliminar.hide()
    setLoading(true);
    const idPDF = PdfToDelete.id?.toString() as string
    console.log('idPDF: ', idPDF);
    ax.get($j('planos_conjunto', "delete", idPDF) )
      .then((response) => {
        doReloadTable()
        addToast('Plano de conjunto eliminado correctamente', {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const msgError = e.response.data.errors 
          ? e.response.data.errors[Object.keys(e.response.data.errors)[0]] 
          : caps('errors:base.post', { element: "plano de conjunto"})
          addToast(msgError,
            { appearance: 'error', autoDismiss: true }
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (<>
    <Col sm={12} className="d-sm-flex justify-content-end align-items-end px-0 py-2">
      
      <Col sm={3} xs={12}>
        <FileInputWithDescription
          id={"inputFile"}
          name={"inputFile"}
          label="Seleccionar Plano de conjunto"
          onChange={handleChangeFile}
          onChangeDisplay={handleChangeDisplay}
          display={display}
          accept={["pdf"]}
        // errors={errorsReportePdf}
        />
      </Col>
      <Col sm={2} md={1} xs={12} >
        <JumpLabel/>
        <Button onClick={onClickEnviar} disabled={reportePdf === null}>
          Guardar
        </Button>
      </Col>
      <div className="col-lg-3 col-md-5 col-sm-6 col-xs-12 " >
        <SearchBar  outerClassName="mb-0" onChange={doSearch} />
      </div>
    </Col>

    <Col sm={12} className=' px-0'>
      {filtersParams.filterByEquipo === undefined ?
        <LoadingSpinner /> :
        <ApiTable<IPlanosConjunto>
          columns={IPlanosConjuntosColumns(intl, { verPDF, deletePdf })}
          source={"planos_conjunto"}
          paginationServe={true}
          filterServeParams={filtersParams}
          search={search}
          reload={reloadTable}
        />
      }
    </Col>
    <Modal show={modalConfirmarEliminar.visible} onHide={modalConfirmarEliminar.hide}>
      <Modal.Header closeButton>
        <b>Eliminar plano de conjunto</b>
      </Modal.Header>
      <Modal.Body>
        Desea eliminar el archivo <b>{PdfToDelete.name}</b> ? <br /> Esta acción es irreversible!
      </Modal.Body>
      <Modal.Footer className="text-right">
        <Button variant="outline-secondary" className="mr-3" onClick={modalConfirmarEliminar.hide} >
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmEliminar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default InsertPlanoConjunto