import React, { useEffect, useState } from 'react'
import { Button, Col, Modal } from 'react-bootstrap'
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { SearchBar } from '../../../Components/Forms/SearchBar';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { FileInputWithDescription } from '../../../Components/Forms/FileInputWithDescription';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { useReload } from '../../../Common/Hooks/useReload';
import { useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { AxiosError } from 'axios';
import { JumpLabel } from '../../../Components/Common/JumpLabel';
import { IPlanosComponentes, IPlanosComponentesColumns } from '../../../Data/Models/Binnacle/PlanosComponentes';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { IComponente } from '../../../Data/Models/Componentes/Componentes';
import { Textbox } from '../../../Components/Forms/Textbox';


interface IPlanoComponente {
  idEquipo: string | undefined
}


const InsertPlanoComponente = ({
  idEquipo
}: IPlanoComponente) => {

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
  const [idComponentSelected, setIdComponentSelected] = useState<string | undefined>(undefined)
  const [nombreComponentSelected, setNombreComponentSelected] = useState<string | undefined>(undefined)
  const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([])

  const [idPlanoConjunto, setIdPlanoConjunto] = useState<string>();
  const [display, setDisplay] = useState<string>();
  const [reportePdf, setReportePdf] = useState<any>(null);
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined
  }>({
    filterByEquipo: undefined
  })
  const [pdfData, setPdfData] = useState<any>(null);
  const [IsLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);

  //Effects 
  useEffect(() => {
    setFiltersParams(state => $u(state, { filterByEquipo: { $set: idEquipo } }))
    if (idEquipo == undefined) { return }
    updateComponentes(idEquipo);
    setIsLoadingPdf(true);
    ax.get<ArrayBuffer>($j('planos_conjunto', "last", idEquipo), { responseType: 'arraybuffer' })
      .then(response => {
        let urlPDF = null
        if (response.data) {
          const archivoPDF = new Blob([response.data], { type: 'application/pdf' });
          urlPDF = URL.createObjectURL(archivoPDF);
        }
        setPdfData(urlPDF);
      }).finally(() => {
        setIsLoadingPdf(false);
      });
  }, [idEquipo])

  //ACTUALIZAR COMPONENTES DE EQUIPO
  const updateComponentes = async (equipoId: string) => {
    setIdComponentSelected(undefined);
    await ax.get<IComponente[]>('service_render/equipos/componentes_asignados', { params: { equipo_id: equipoId } })
      .then((response) => {
        setComponentsForTraining(response.data);
        setIdComponentSelected(response.data.length > 0 ? response.data[0].id : undefined);
        setNombreComponentSelected(response.data.length > 0 ? response.data[0].nombre : undefined);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.load', { element: "componentes" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        // setLoadingData(false);
      });
  }

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
    formData.append("idComponente", idComponentSelected as string);
    if (idPlanoConjunto !== undefined) {
      formData.append("idPlanoConjunto", idPlanoConjunto as string);
    }

    setLoading(true);
    await ax.post('planos_componentes', formData, headers)
      .then((response) => {
        setDisplay(undefined)
        setIdPlanoConjunto("")
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
            : caps('errors:base.post', { element: "planos de componentes" })
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
    ax.get<string | Blob | File>($j('planos_componentes', "ver", pdf_name), { responseType: 'blob' })
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
    ax.get($j('planos_componentes', "delete", idPDF))
      .then((response) => {
        doReloadTable()
        addToast('Plano de componente eliminado correctamente', {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const msgError = e.response.data.errors
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : caps('errors:base.post', { element: "plano de componente" })
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

    {
      IsLoadingPdf ?
        <Col sm={12} className='px-0'> <LoadingSpinner /> </Col>
        : (
          <Col sm={12} className='px-0'>
            <Col sm={12} className="d-sm-flex justify-content-start align-items-end px-0 py-2">
              <Col sm={3} xs={12}>
                <ApiSelect<IComponente>
                  name='componente'
                  label='Componente'
                  placeholder='Seleccione componente'
                  className='mb-0'
                  source={componentsForTraining}
                  value={idComponentSelected}
                  selector={(option: IComponente) => {
                    return { label: option.nombre, value: option.id.toString() };
                  }}
                  valueInObject={true}
                  onChange={(data) => {
                    setIdComponentSelected(data.value ?? data)
                    data.label && setNombreComponentSelected(data.label)
                  }}
                // isLoading={loadingData}
                // isDisabled={loadingData}
                />
              </Col>
              <Col sm={2} xs={12}>
                <FileInputWithDescription
                  id={"inputFile"}
                  name={"inputFile"}
                  label="Plano"
                  onChange={handleChangeFile}
                  onChangeDisplay={handleChangeDisplay}
                  display={display}
                  accept={["pdf"]}
                />
              </Col>

              <Col sm={2} xs={12} >
                <Textbox
                  id='id_plano'
                  name='id_plano'
                  label={'Id en plano de conjunto'}
                  value={idPlanoConjunto}
                  onChange={
                    (data) => {
                      setIdPlanoConjunto(data as string)
                    }
                  }
                />
              </Col>
              <Col sm={2} xs={12} >
                <JumpLabel />
                <Button onClick={onClickEnviar} disabled={reportePdf === null || idComponentSelected === undefined}>
                  Guardar
                </Button>
              </Col>
            </Col>

            <Col sm={12} xl={6} className="d-none py-2 d-sm-inline-block" style={{ height: "100vh" }} >
              <object
                data={pdfData}
                type='application/pdf'
                width="100%"
                height="100%"
              />
            </Col>

            <Col sm={12} xl={6} className="px-0 py-2">
              <Col sm={12} className="d-sm-flex justify-content-end align-items-end px-0 py-2">
                <div className="col-lg-6 col-md-8 col-sm-10 col-xs-12 " >
                  <SearchBar outerClassName="mb-0" onChange={doSearch} />
                </div>
              </Col>

              <Col sm={12} className=' px-0'>
                {filtersParams.filterByEquipo === undefined ?
                  <LoadingSpinner /> :
                  <ApiTable<IPlanosComponentes>
                    columns={IPlanosComponentesColumns(intl, { verPDF, deletePdf })}
                    source={"planos_componentes"}
                    paginationServe={true}
                    filterServeParams={filtersParams}
                    search={search}
                    reload={reloadTable}
                  />
                }
              </Col>
            </Col>
          </Col>
        )
    }

    <Modal show={modalConfirmarEliminar.visible} onHide={modalConfirmarEliminar.hide}>
      <Modal.Header closeButton>
        <b>Eliminar plano de componente</b>
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

export default InsertPlanoComponente