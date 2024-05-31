import React, { RefObject, useEffect, useRef, useState } from "react";
import { BaseContentView } from "../Common/BaseContentView";
import { Button, Col } from "react-bootstrap";
import { ApiSelect } from "../../Components/Api/ApiSelect";
import { Equipo } from "../../Data/Models/Equipo/Equipo";
import { $m, $u } from "../../Common/Utils/Reimports";
import { Datepicker } from "../../Components/Forms/Datepicker";
import { Textbox } from "../../Components/Forms/Textbox";
import { useDebounce } from "use-debounce/lib";
import { useNavigation } from "../../Common/Hooks/useNavigation";
import { BounceLoader } from "react-spinners";
import { ax } from "../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { ProjectionPolinomio } from "../../Data/Models/Proyeccion/Polinomio";
import { useToasts } from "react-toast-notifications";
import { LoadingSpinner } from "../../Components/Common/LoadingSpinner";
import { JSONObject } from "../../Data/Models/Common/general";
import { JumpLabel } from "../../Components/Common/JumpLabel";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ContentLineGraph from "../../Components/Graphs/ContentLineGraph";
import imageHeaderPdf from "../../Assets/pdf/headerProyecciones.png";
import logoFooterPdf from "../../Assets/pdf/logoEmpresa.png";
import { useDashboard } from "../../Common/Hooks/useDashboard";

const Projections = () => {
  //HOOKS
  const { stateAs } = useNavigation();
  const dataStateAs = stateAs<{ data: { id: string } }>();
  const { addToast } = useToasts();
  const { setLoading } = useDashboard();

  //STATES
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined;
    nameSelectedEquipo?: string | undefined;
  }>({
    filterByEquipo: dataStateAs == null ? undefined : "-1",
  });
  const [IsFilter, setIsFilter] = useState<boolean>(false);
  const [IsDownloadPdf, setIsDownloadPdf] = useState<boolean>(false);
  const [showMediciones, setShowMediciones] = useState<boolean>(true);
  const [CriticalCondition, setCriticalCondition] = useState<{
    type: string;
    value: string | undefined;
  }>({
    type: "FECHA",
    value: $m().format("DD-MM-YYYY"),
  });

  interface IFilterCriterio {
    x?: number | string;
    y?: null | number;
    date?: string;
    position?: number;
  }
  const [FilterCriterioMill, setFilterCriterioMill] = useState<
    IFilterCriterio[]
  >([]);
  const [valueSearch] = useDebounce(CriticalCondition.value, 1500);
  const [TipoEspesor, setTipoEspesor] = useState<string>("placa");
  const [DataComponents, setDataComponents] = useState<ProjectionPolinomio[]>();
  const [IsLoadData, setIsLoadData] = useState<boolean>(true);
  const [selectUbicacion, setSelectUbicacion] = useState<
    { label: string; value: string }[]
  >([
    { label: "LIFTER", value: "lifter" },
    { label: "PLACA", value: "placa" },
    // { label: "PLACA B", value: "placa_b" },
  ]);

  const labelUbicacion: JSONObject = {
    lifter: "LIFTER",
    placa: "PLACA",
    placa_b: "PLACA B",
  };
  const imagesRef = useRef<HTMLDivElement[]>([]);

  //HANDLES
  const getGraphsComponents = () => {
    let graphs: (JSX.Element | undefined)[] = [];

    DataComponents?.forEach((element, index) => {
      let data: { x: any; y: any }[] = [];
      let mediciones: { x: any; y: any }[] = [];
      let puntoCritico: number | undefined = undefined;

      if (TipoEspesor === "placa") {
        data = DataComponents[index].data.placa ?? [];
        mediciones = DataComponents[index].mediciones.placa ?? [];
        puntoCritico = DataComponents[index].puntosCriticos?.placa ?? undefined;
      }

      if (TipoEspesor === "placa_b") {
        data = DataComponents[index].data.placa_b ?? [];
        mediciones = DataComponents[index].mediciones.placa_b ?? [];
        puntoCritico =
          DataComponents[index].puntosCriticos?.placa_b ?? undefined;
      }

      if (TipoEspesor === "lifter") {
        data = DataComponents[index].data.lifter ?? [];
        mediciones = DataComponents[index].mediciones.lifter ?? [];
        puntoCritico =
          DataComponents[index].puntosCriticos?.lifter ?? undefined;
      }
      // graphs.push(
      //   <Col sm={4} style={{ height: '36vh' }} ref={imageRef} className='py-3' key={`graph-component-${index}`}>
      //     <Col className='h-100 p-0'>
      //       <LineGraph title={DataComponents[index].nombre}
      //         dataLine={data}
      //         dataMedicion={mediciones}
      //         timestamps={DataComponents[index].timeStamp ?? []}
      //         dataSelected={FilterCriterioMill[index]}
      //         fecha_medicion={DataComponents[index].crea_date}
      //         showMediciones={showMediciones}
      //         puntoCritico={puntoCritico}
      //       />
      //     </Col>
      //   </Col>
      // )
      graphs.push(
        <ContentLineGraph
          index={index}
          title={DataComponents[index].nombre}
          dataLine={data}
          dataMedicion={mediciones}
          timestamps={DataComponents[index].timeStamp ?? []}
          dataSelected={FilterCriterioMill[index]}
          fecha_medicion={DataComponents[index].crea_date}
          showMediciones={showMediciones}
          puntoCritico={puntoCritico}
          onImageRef={handleImageRef(index)}
        />
      );
    });
    return graphs;
  };

  const findMillForDate = (date: string | undefined) => {
    const filterSelect: IFilterCriterio[] = [];
    DataComponents?.forEach((mill) => {
      let existDate: boolean = false;
      const dataEspesores =
        TipoEspesor === "placa"
          ? mill.data?.placa
          : TipoEspesor === "placa_b"
          ? mill.data?.placa_b
          : mill.data?.lifter;

      if (date && dataEspesores) {
        const dateParse = $m(date, "DD-MM-YYYY").format("YYYY-MM-DD");

        mill.timeStamp?.forEach((timeStamp, dataPosition) => {
          if (timeStamp === dateParse) {
            existDate = true;
            filterSelect.push({
              x: dataEspesores[dataPosition].x,
              y: dataEspesores[dataPosition].y,
              date: timeStamp,
              position: dataPosition,
            });
            return;
          }
        });
      }
      if (!existDate) {
        filterSelect.push({
          x: undefined,
          y: undefined,
          date: undefined,
        });
      }
    });
    setFilterCriterioMill((state) => $u(state, { $set: filterSelect }));
  };

  const findMillForEspesor = (espesor: string | undefined) => {
    const filterSelect: IFilterCriterio[] = [];
    DataComponents?.forEach((mill) => {
      const dataEspesores =
        TipoEspesor === "placa"
          ? mill.data?.placa
          : TipoEspesor === "placa_b"
          ? mill.data?.placa_b
          : mill.data?.lifter;

      let existEspesor: boolean = false;
      if (espesor && dataEspesores) {
        dataEspesores.some((data, dataPosition) => {
          if (parseInt(data.y) <= parseInt(espesor)) {
            existEspesor = true;
            filterSelect.push({
              x: data.x,
              y: data.y,
              date: mill.timeStamp[dataPosition],
              position: dataPosition,
            });
            return true; // stops the iteration
          }
          return false;
        });
      }
      if (!existEspesor) {
        const sizeEspesores = dataEspesores ? dataEspesores?.length : 0;
        const lastRegister =
          sizeEspesores > 0 ? dataEspesores![sizeEspesores - 1] : undefined;
        const isGreaterThan = espesor && lastRegister?.y > espesor;

        filterSelect.push({
          x: isGreaterThan ? lastRegister?.x : undefined,
          y: isGreaterThan ? lastRegister?.y : undefined,
          date: isGreaterThan ? mill.timeStamp[sizeEspesores - 1] : undefined,
          position: isGreaterThan ? sizeEspesores : undefined,
        });
      }
    });

    setFilterCriterioMill((state) => $u(state, { $set: filterSelect }));
  };

  const getData = async () => {
    setIsLoadData(true);
    await ax
      .get<ProjectionPolinomio[]>("service_render/proyeccion_pl", {
        params: { equipoId: filtersParams.filterByEquipo },
      })
      .then((response) => {
        setDataComponents(response.data);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast("Error al cargar los datos del equipo", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .finally(() => {
        setIsLoadData(false);
      });
  };

  //EFFECTS
  useEffect(() => {
    if (IsDownloadPdf) {
      setLoading(true);
      printChart();
    }
  }, [IsDownloadPdf]);

  useEffect(() => {
    if (
      filtersParams.filterByEquipo === undefined ||
      filtersParams.filterByEquipo === "-1"
    )
      return;
    getData();
  }, [filtersParams.filterByEquipo]);

  useEffect(() => {
    const idEquipo = dataStateAs?.data?.id;
    setFiltersParams((state) =>
      $u(state, { filterByEquipo: { $set: idEquipo } })
    );
  }, [dataStateAs]);

  useEffect(() => {
    setCriticalCondition((state) =>
      $u(state, {
        value: {
          $set:
            CriticalCondition.type === "FECHA"
              ? $m().format("DD-MM-YYYY")
              : undefined,
        },
      })
    );
  }, [filtersParams.filterByEquipo]);

  useEffect(() => {
    if (CriticalCondition.type === "FECHA") {
      findMillForDate(valueSearch);
    }

    if (CriticalCondition.type === "ESPESOR") {
      findMillForEspesor(valueSearch);
    }
    setIsFilter(false);
  }, [valueSearch, TipoEspesor, DataComponents]);

  useEffect(() => {
    if (DataComponents === undefined || DataComponents?.length === 0) {
      return;
    }

    const keys = DataComponents?.reduce((acc: any, obj) => {
      const dataKeys = Object.keys(obj.data);
      return [...acc, ...dataKeys];
    }, []);

    const keysUnique: string[] = Array.from(new Set(keys));

    const transKeyToOptions: { label: string; value: string }[] =
      keysUnique.map((key: string) => {
        return {
          label: labelUbicacion[key] as string,
          value: key,
        };
      });

    setSelectUbicacion(transKeyToOptions);
  }, [DataComponents]);

  const handleImageRef = (index: number) => (ref: HTMLDivElement) => {
    imagesRef.current[index] = ref;

    // imagesRef.current.push(ref)
  };

  const footerPDF = (pdf: jsPDF, bgColor: string, marginX: number) => {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const yPos = pageHeight - 16;

    pdf.setFillColor(bgColor);
    pdf.rect(marginX, yPos, pageWidth - marginX * 2, 7, "F");
    pdf.addImage(logoFooterPdf, "PNG", marginX + 10, yPos + 1, 60, 5);

    const firstFooterText =
      "©CIA. MINERA DOÑA INÉS DE COLLAHUASI - TEICSER SpA. 2023. All rights reserved - www.collahuasi.com";
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text(firstFooterText, 129, yPos + 3);

    const secondFooterText =
      "Reproduction in whole or in part is prohibited without the prior written consent of the copyright owner";
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(secondFooterText, 150, yPos + 6);
  };

  const headerPDf = (pdf: jsPDF, bgColor: string, marginX: number) => {
    const title = `ANÁLISIS ${filtersParams.nameSelectedEquipo}`;
    const subTitle = `PROYECCIONES REVESTIMIENTOS`;
    const pageWidth = pdf.internal.pageSize.width;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setFillColor(bgColor);
    pdf.setTextColor("#ffffff");

    pdf.addImage(imageHeaderPdf, "PNG", 10, 10, pageWidth - marginX * 2, 18);

    //TITULO
    pdf.rect(marginX, 29, pageWidth - marginX * 2, 9, "F");
    var titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 36);

    //SUB-TITULO
    pdf.setFillColor(bgColor);
    pdf.rect(marginX, 39, pageWidth - marginX * 2, 8, "F");
    var subTitleWidth = pdf.getTextWidth(subTitle);
    pdf.text(subTitle, (pageWidth - subTitleWidth) / 2, 45);
  };

  const printChart = () => {
    const pdf = new jsPDF("landscape", "mm", "a4");

    const bgColor = "#2c542e";
    const marginX = 10;

    headerPDf(pdf, bgColor, marginX);
    footerPDF(pdf, bgColor, marginX);

    let isFirstRow = false;
    let positionGraphInRow = 0;
    const sizeHeader = 50;
    const heightGraph = 70;
    const widthGraph = 92;

    imagesRef.current.forEach((imageRef, index) => {
      const input = imageRef;
      if (input) {
        html2canvas(input).then((canvas) => {
          //BANDERA CON 1 Y 2 PARA IR ALTERNADO ENTRE PRIMERA Y SEGUNDA FILA
          positionGraphInRow = positionGraphInRow + 1;
          if (index % 3 === 0) {
            isFirstRow = !isFirstRow;
            positionGraphInRow = 0;
          }

          const positionGraphY = isFirstRow
            ? sizeHeader
            : sizeHeader + heightGraph;
          const positionGraphX = positionGraphInRow * widthGraph + marginX;
          const imgData = canvas.toDataURL("image/png");
          pdf.addImage(
            imgData,
            "PNG",
            positionGraphX,
            positionGraphY,
            widthGraph,
            heightGraph
          );

          // Descargar el PDF cuando se hayan agregado todas las imágenes
          if (index === imagesRef.current.length - 1) {
            setIsDownloadPdf(false);
            setLoading(false);
            pdf.save("PROYECCIONES_REVESTIMIENTOS.pdf");
          }

          if ((index + 1) % 6 === 0) {
            pdf.addPage();
            headerPDf(pdf, bgColor, marginX);
            footerPDF(pdf, bgColor, marginX);
            positionGraphInRow = 0;
          }
        });
      }
    });
  };

  return (
    <BaseContentView title="Proyecciones">
      <Col sm={12} className="px-0">
        <Col sm={2}>
          <ApiSelect<Equipo>
            name="equipo_select"
            placeholder="Seleccione"
            source={"service_render/equipos"}
            label={"Equipo"}
            value={filtersParams.filterByEquipo}
            selector={(option) => {
              return { label: option.nombre, value: option.id.toString() };
            }}
            valueInObject={true}
            onChange={(data) => {
              setFiltersParams((state) =>
                $u(state, {
                  filterByEquipo: { $set: data?.value ?? data },
                  nameSelectedEquipo: { $set: data?.label ?? undefined },
                })
              );
            }}
          />
        </Col>

        <Col sm={2}>
          <ApiSelect
            name="typo_espesor_select"
            label="Ubicación"
            value={TipoEspesor}
            source={selectUbicacion}
            selector={(option) => {
              return { label: option.label, value: option.value };
            }}
            onChange={(data) => {
              setTipoEspesor(data);
            }}
          />
        </Col>

        <Col sm={2}>
          <ApiSelect
            name="criterio_select"
            label="Criterio de cambio"
            value={
              CriticalCondition.type == undefined
                ? "-1"
                : CriticalCondition.type
            }
            source={[
              // { label: "NINGUNO", value: "-1" },
              { label: "FECHA", value: "FECHA" },
              { label: "ESPESOR CRÍTICO", value: "ESPESOR" },
            ]}
            selector={(option) => {
              return { label: option.label, value: option.value };
            }}
            onChange={(data) => {
              setCriticalCondition((state) =>
                $u(state, {
                  type: { $set: data !== "-1" ? data : undefined },
                  value: { $set: undefined },
                })
              );
            }}
          />
        </Col>

        <Col sm={2} hidden={CriticalCondition.type !== "FECHA"}>
          <Datepicker
            label="Fecha criterio"
            value={
              CriticalCondition.type === "FECHA"
                ? CriticalCondition.value
                : undefined
            }
            onChange={(value) => {
              setIsFilter(true);
              setCriticalCondition((state) =>
                $u(state, { value: { $set: value } })
              );
            }}
          />
        </Col>

        <Col sm={2} hidden={CriticalCondition.type !== "ESPESOR"}>
          <Textbox
            label="Buscar espesor"
            value={CriticalCondition.value ?? ""}
            name={"espesor"}
            id={"espesor"}
            placeholder={"número entero"}
            onlyNumber={true}
            onChange={(data) => {
              setIsFilter(true);
              setCriticalCondition((state) =>
                $u(state, {
                  value: { $set: data as string },
                })
              );
            }}
          />
        </Col>

        <Col sm={2}>
          <div
            className="d-flex align-items-center justify-content-start"
            style={{ height: "68px", gap: "8px" }}
          >
            <label className="mb-0">
              <b>Mostrar Mediciones:</b>
            </label>
            <input
              type="checkbox"
              id={"show_mediciones"}
              name={"show_mediciones"}
              checked={showMediciones}
              style={{ width: "20px", height: "20px" }}
              onChange={() => {
                const isShowMediciones = !showMediciones;
                setShowMediciones(isShowMediciones);
              }}
            />
          </div>
        </Col>

        <Col sm={2}>
          <JumpLabel />
          <Button
            disabled={
              !(DataComponents && DataComponents.length > 0) || IsDownloadPdf
            }
            onClick={() => {
              setIsDownloadPdf(true);
            }}
            className="w-100 d-flex justify-content-center align-items-center"
          >
            <i
              className={`mx-2 ${
                IsDownloadPdf
                  ? "fas fa-circle-notch fa-spin"
                  : "fas fa-file-pdf fa-lg"
              }`}
            />
            <span className="mx-2">Descargar</span>
          </Button>
        </Col>

        <Col sm={2} style={{ height: "66px" }} hidden={!IsFilter}>
          <Col sm={12} className="p-0 pt-3 h-100 d-flex align-items-center">
            <BounceLoader color="var(--primary)" size={18} />
            <span
              className="pl-3"
              style={{ color: "var(--primary)" }}
            >{`Buscando ${CriticalCondition.type.toLowerCase()} ...`}</span>
          </Col>
        </Col>
      </Col>
      <Col sm={12} className="px-0" id="container-charts">
        {IsLoadData ? (
          <LoadingSpinner />
        ) : DataComponents && DataComponents.length > 0 ? (
          getGraphsComponents()
        ) : (
          <Col sm={12} className="text-center">
            <Col className="alert alert-info mb-0 mt-5" sm={6}>
              <i className="fa fa-info mr-2" aria-hidden="true" />
              No se encontraron componentes
            </Col>
          </Col>
        )}
      </Col>
    </BaseContentView>
  );
};

export default Projections;
