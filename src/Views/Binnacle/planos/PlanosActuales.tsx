import React, { useEffect, useRef, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useSearch } from '../../../Common/Hooks/useSearch';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { useToasts } from 'react-toast-notifications';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { IPlanosComponentes, IPlanosComponentesColumnView } from '../../../Data/Models/Binnacle/PlanosComponentes';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
// import { Document, Page, pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
interface IPlanosActualesProps {
  idEquipo: string | undefined
}


const PlanosActuales = ({
  idEquipo
}: IPlanosActualesProps) => {

  const { intl, capitalize: caps } = useFullIntl();
  const { setLoading } = useDashboard();

  //states
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined
  }>({
    filterByEquipo: undefined
  })
  const [pdfData, setPdfData] = useState<any>(null);
  const [IsLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);

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


  //Effects 
  useEffect(() => {
    setFiltersParams(state => $u(state, { filterByEquipo: { $set: idEquipo } }))
    if (idEquipo == undefined) { return }
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

  return (<>
    {
      IsLoadingPdf ?
        <Col sm={12} className='px-0'> <LoadingSpinner /> </Col>
        : (<>
          <Col sm={12} className='px-0'>

            <Col sm={12} xl={6} className="d-none d-sm-inline-block" style={{ height: "73vh" }} >

              <object
                data={pdfData}
                type='application/pdf'
                width="100%"
                height="100%"
              />
            </Col>
            <Col sm={12} xl={6} className="px-0">
              <ApiTable<IPlanosComponentes>
                columns={IPlanosComponentesColumnView(intl, { verPDF })}
                source={"planos_componentes/actuales"}
                paginationServe={true}
                filterServeParams={filtersParams}
              />
            </Col>
          </Col>
        </>)
    }
  </>)
}

export default PlanosActuales