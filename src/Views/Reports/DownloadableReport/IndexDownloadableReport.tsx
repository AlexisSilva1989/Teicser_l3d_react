import React, { useState } from "react";
import { Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { BaseContentView } from "../../Common/BaseContentView";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import { $j, $d, $u } from "../../../Common/Utils/Reimports";
import { ApiTable } from "../../../Components/Api/ApiTable";
import { LocalizedColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from "../../../Common/Hooks/useDashboard";
import { useToasts } from "react-toast-notifications";
import { useReload } from "../../../Common/Hooks/useReload";
import { useSearch } from "../../../Common/Hooks/useSearch";
import { SearchBar } from "../../../Components/Forms/SearchBar";
import { ApiSelect } from "../../../Components/Api/ApiSelect";
import { Equipo } from "../../../Data/Models/Equipo/Equipo";
import { PdfColumns, reportePdf } from "../Reports_pdf/IndexReportsPdf";

export const IndexDownloadableReport = () => {
  //hooks
  const { capitalize: caps, intl } = useFullIntl();
  const { setLoading } = useDashboard();
  const api = useApi();
  const { addToast } = useToasts();
  const [reloadTable, doReloadTable] = useReload();

  //states
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined;
  }>({
    filterByEquipo: undefined,
  });
  const [search, doSearch] = useSearch();

  const pdfDescargar = (pdf: any) => {
    setLoading(true);
    api
      .get<string | Blob | File>($j("descargar_pdf", pdf.ruta.toString()), {
        responseType: "blob",
      })
      .success((e) => {
        $d(e, pdf.pdf_name);
        addToast(caps("success:base.success"), {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .fail("Error al descargar archivo")
      .finally(() => setLoading(false));
  };

  const colums = PdfColumns(intl);

  colums.push({
    name: "Opción",
    center: true,
    width: "10%",
    cell: (pdf) => (
      <>
        <Col sm={6}>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-1`}>descargar</Tooltip>}
          >
            <i
              className="fas fas fa-file-pdf"
              style={{ cursor: "pointer", color: "#09922C" }}
              onClick={() => pdfDescargar(pdf)}
            />
          </OverlayTrigger>
        </Col>
      </>
    ),
  });

  return (
    <>
      <BaseContentView title="titles:reports_pdf">
        <Col
          sm={12}
          className="d-flex justify-content-end align-items-end pr-0 pl-0"
        >
          <Col sm={3}>
            <ApiSelect<Equipo>
              name="equipo_select"
              placeholder="Seleccione"
              source={"service_render/equipos"}
              label={"Equipo"}
              value={
                filtersParams.filterByEquipo == undefined
                  ? "-1"
                  : filtersParams.filterByEquipo
              }
              firtsOptions={{ label: "TODOS", value: "-1" }}
              selector={(option) => {
                return { label: option.nombre, value: option.id.toString() };
              }}
              onChange={(data) => {
                setFiltersParams((state) =>
                  $u(state, {
                    filterByEquipo: { $set: data != "-1" ? data : undefined },
                  })
                );
              }}
            />
          </Col>

          <div
            className="col-lg-3 col-md-5 col-sm-6"
            style={{ verticalAlign: "bottom" }}
          >
            <SearchBar onChange={doSearch} />
          </div>
        </Col>
        <Col sm={12}>
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
