import React, { useEffect, useState } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { useSearch } from "../../../Common/Hooks/useSearch";
import { $j, $u } from "../../../Common/Utils/Reimports";
import { SearchBar } from "../../../Components/Forms/SearchBar";
import { LoadingSpinner } from "../../../Components/Common/LoadingSpinner";
import { ApiTable } from "../../../Components/Api/ApiTable";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { useReload } from "../../../Common/Hooks/useReload";
import { useToasts } from "react-toast-notifications";
import { useDashboard } from "../../../Common/Hooks/useDashboard";
import { useShortModal } from "../../../Common/Hooks/useModal";
import { AxiosError } from "axios";
import {
  IPlanosComponentes,
  IPlanosComponentesColumns,
} from "../../../Data/Models/Binnacle/PlanosComponentes";
import { IComponente } from "../../../Data/Models/Componentes/Componentes";

interface IPlanoComponente {
  idEquipo: string | undefined;
  reloadTable: boolean;
  doReloadTable: () => void;
}

const InsertPlanoComponente = ({
  idEquipo,
  doReloadTable,
  reloadTable,
}: IPlanoComponente) => {
  const [search, doSearch] = useSearch();
  const { intl, capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const { setLoading } = useDashboard();
  const modalConfirmarEliminar = useShortModal();

  //states
  const [PdfToDelete, setPdfToDelete] = useState<{
    id: string | undefined;
    name: string | undefined;
  }>({ id: undefined, name: undefined });
  // const [idComponentSelected, setIdComponentSelected] = useState<string | undefined>(undefined)
  // const [nombreComponentSelected, setNombreComponentSelected] = useState<string | undefined>(undefined)
  // const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([])

  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined;
  }>({
    filterByEquipo: undefined,
  });
  const [pdfData, setPdfData] = useState<any>(null);
  const [IsLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);

  //Effects
  useEffect(() => {
    setFiltersParams((state) =>
      $u(state, { filterByEquipo: { $set: idEquipo } })
    );
    if (idEquipo == undefined) {
      return;
    }
    // updateComponentes(idEquipo);
    setIsLoadingPdf(true);
    ax.get<ArrayBuffer>($j("planos_conjunto", "last", idEquipo), {
      responseType: "arraybuffer",
    })
      .then((response) => {
        let urlPDF = null;
        if (response.data) {
          const archivoPDF = new Blob([response.data], {
            type: "application/pdf",
          });
          urlPDF = URL.createObjectURL(archivoPDF);
        }
        setPdfData(urlPDF);
      })
      .finally(() => {
        setIsLoadingPdf(false);
      });
  }, [idEquipo]);

  //ACTUALIZAR COMPONENTES DE EQUIPO
  // const updateComponentes = async (equipoId: string) => {
  //   setIdComponentSelected(undefined);
  //   await ax.get<IComponente[]>('service_render/equipos/componentes_asignados', { params: { equipo_id: equipoId } })
  //     .then((response) => {
  //       setComponentsForTraining(response.data);
  //       setIdComponentSelected(response.data.length > 0 ? response.data[0].id : undefined);
  //       setNombreComponentSelected(response.data.length > 0 ? response.data[0].nombre : undefined);
  //     })
  //     .catch((e: AxiosError) => {
  //       if (e.response) {
  //         addToast(caps('errors:base.load', { element: "componentes" }), {
  //           appearance: 'error',
  //           autoDismiss: true,
  //         });
  //       }
  //     }).finally(() => {
  //       // setLoadingData(false);
  //     });
  // }

  const verPDF = async (pdf_name: string) => {
    setLoading(true);
    ax.get<string | Blob | File>($j("planos_componentes", "ver", pdf_name), {
      responseType: "blob",
    })
      .then((response) => {
        const archivoPDF = new Blob([response.data], {
          type: "application/pdf",
        });
        const urlPDF = URL.createObjectURL(archivoPDF);
        window.open(urlPDF);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deletePdf = async (pdf_name: string, id: string) => {
    modalConfirmarEliminar.show();
    setPdfToDelete({ id, name: pdf_name });
  };

  const onConfirmEliminar = async () => {
    modalConfirmarEliminar.hide();
    setLoading(true);
    const idPDF = PdfToDelete.id?.toString() as string;
    ax.get($j("planos_componentes", "delete", idPDF))
      .then((response) => {
        doReloadTable();
        addToast("Plano de componente eliminado correctamente", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          const msgError = e.response.data.errors
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : caps("errors:base.post", { element: "plano de componente" });
          addToast(msgError, { appearance: "error", autoDismiss: true });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {IsLoadingPdf ? (
        <Col sm={12} className="px-0">
          {" "}
          <LoadingSpinner />{" "}
        </Col>
      ) : (
        <Col sm={12} className="px-0">
          <Col
            sm={12}
            xl={6}
            className="d-none d-sm-inline-block"
            style={{ height: "73vh" }}
          >
            <object
              data={pdfData}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </Col>

          <Col sm={12} xl={6} className="px-0">
            <Col
              sm={12}
              className="d-sm-flex justify-content-end align-items-end px-0 py-2"
            >
              <div className="col-lg-6 col-md-8 col-sm-10 col-xs-12 ">
                <SearchBar outerClassName="mb-0" onChange={doSearch} />
              </div>
            </Col>

            <Col sm={12} className="">
              {filtersParams.filterByEquipo === undefined ? (
                <LoadingSpinner />
              ) : (
                <ApiTable<IPlanosComponentes>
                  columns={IPlanosComponentesColumns(intl, {
                    verPDF,
                    deletePdf,
                  })}
                  source={"planos_componentes"}
                  paginationServe={true}
                  filterServeParams={filtersParams}
                  search={search}
                  reload={reloadTable}
                />
              )}
            </Col>
          </Col>
        </Col>
      )}

      <Modal
        show={modalConfirmarEliminar.visible}
        onHide={modalConfirmarEliminar.hide}
      >
        <Modal.Header closeButton>
          <b>Eliminar plano de componente</b>
        </Modal.Header>
        <Modal.Body>
          Desea eliminar el archivo <b>{PdfToDelete.name}</b> ? <br /> Esta
          acción es irreversible!
        </Modal.Body>
        <Modal.Footer className="text-right">
          <Button
            variant="outline-secondary"
            className="mr-3"
            onClick={modalConfirmarEliminar.hide}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InsertPlanoComponente;
