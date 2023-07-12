import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { $m, $u } from '../../Common/Utils/Reimports';
import { YAxis } from 'recharts';

interface serieData {
  x: any;
  y: any;
  fillColor?: string | undefined;
  strokeColor?: string | undefined;
  meta?: any;
  goals?: any;
  usadoEnEntrenamiento?: boolean
  timestamp?: string
  camp?: number
}
interface ILineGraph {
  title: string
  dataLine: ApexAxisChartSeries | serieData[]
  dataMedicion: ApexAxisChartSeries | serieData[]
  timestamps: string[]
  fecha_medicion: string
  dataSelected: {
    x?: number | string
    y?: null | number
    date?: string
    position?: number
  },
  showMediciones: boolean
}



function LineGraph({ dataLine, dataMedicion, dataSelected, title, fecha_medicion, showMediciones }: ILineGraph) {
  const primaryColor = '#0D47A1'
  const selectedColor = '#004D40'
  const [dataSerie, setDataSerie] = useState<{ name?: string, color?: string, type: string, data: serieData[] }[]>(
    [
      {
        type: 'line',
        color: primaryColor,
        data: []
      },
      {
        type: 'scatter',
        color: '#febc3b',
        data: []
      }
    ],
  )

  const [dataGraph, setDataGraph] = useState<ApexOptions>({
    chart: {
      type: "line",
      height: "350",
      width: "100%",
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: function(event, chartContext, config) {
          const dataPointIndex = config.dataPointIndex;
          const dataPointSelected: serieData = (dataMedicion as serieData[])[dataPointIndex];
          if(!dataPointSelected.usadoEnEntrenamiento)
            return
          
          console.log(dataPointSelected);
          chartContext.updateOptions({
            tooltip: {
              enabled: true,
              custom: function(e: any) {
                return (`
                  <div class="arrow_box p-3">
                  <b>Fecha:<b> ${dataPointSelected.timestamp}
                  <br><b>Campaña:<b> ${dataPointSelected.camp}
                  </div>
                `);
              },
            }
          });
        },
        dataPointMouseLeave: (event, chartContext, config) => {
        if ( chartContext.w.config.tooltip.enabled) {
            chartContext.updateOptions({
              tooltip: {
                enabled: false,
              }
            });
          }
        }
      }
    },
    colors: [primaryColor],
    grid: {
      show: false,
      borderColor: '#90A4AE',
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    stroke: {
      width: 2,
      lineCap: 'round',
    },
    xaxis: {

      type: 'numeric',
      // tickAmount: 'dataPoints',
      min:0,
      max: undefined,
      tickAmount: 10,
      title: {
        text: 'Tonelaje procesado acumulado [MMTon]',
        offsetY: -4,
        style: {
          fontSize: '11px',
          fontWeight: 600,
          color: primaryColor
        }
      },
      crosshairs: {
        show: false
      },
      tooltip:{
        enabled: false
      },
      // axisTicks: {
      //   show: true,
      //   height: 12,
      // },
      // axisBorder: {
      //   show: true,
      //   offsetX: 0,
      //   offsetY: 0
      // },
      labels: {
        rotate: -45,
        rotateAlways: true,
        // minHeight: 35,
        // offsetY: 12,
        formatter: function (val) {
          const value = Number(val)
          const valueFormat = value % 1 === 0 ? val : value.toFixed(1)
          return valueFormat.toString()
        }
      },

    },
    yaxis: {
      tickAmount: 9,
      title: {
        text: 'Espesor [mm]',
        style: {
          fontSize: '11px',
          fontWeight: 600,
          color: primaryColor
        }
      },
      min: 0,
      max: 450,
      axisBorder: {
        show: true,
        offsetX: -1,
        offsetY: 0
      },
      labels: {
        formatter: function (val) {
          const value = Number(val)
          const valueFormat = value % 1 === 0 ? val : value.toFixed(2)
          return valueFormat.toString()
        }
      }
    },
    annotations: {
      xaxis: [
        {
          x: undefined,
          strokeDashArray: 2,
          borderColor: selectedColor,
        }
      ],
      yaxis: [
        {
          y: undefined,
          borderColor: 'transparent',
          label: {
            // offsetX: -8,
            // offsetY: -8,
            position: 'right',
            borderColor: primaryColor,
            style: {
              color: '#fff',
              background: primaryColor,
            },
            
            text: undefined,
          }
        },
        {
          y: undefined,
          strokeDashArray: 2,
          borderColor: 'transparent',
          label: {
            offsetX: -8,
            offsetY: 19,
            position: 'right',
            borderColor: '#006064',
            style: {
              color: '#fff',
              background: '#006064',
            },
            text: undefined,
          }
        }
      ],
      points:
        [
          {
            x: undefined,
            y: undefined,
            yAxisIndex: 0,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: selectedColor,
              strokeWidth: 2,
              shape: 'circle'
            }
          }
        ]
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: undefined,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#263238'
      },
    },
    subtitle:
    {
      text: undefined,
      align: 'right',
      margin: 0,
      style: {
        fontSize: '11px',
        color: '#666'
      }
    },
    noData: {
      text: 'Sin datos',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    tooltip: {
      enabled: false,
      shared: false,
      followCursor: true
    },
    legend: {
      show: false
    },
    markers: {
      size: [0, 4],
      hover: {
        size: 0
      },
      strokeWidth: 0,
    },

  });

  useEffect(() => {
    setDataGraph((s) => $u(s, {
      title: {
        text: { $set: title }
      },
      subtitle:{
        text: { $set: `Última medición: ${fecha_medicion}` }
      },
      annotations: {
        points: {
          [0]: {
            x: { $set: Number(dataSelected?.x) },
            y: { $set: dataSelected?.y }
          }
        },
        xaxis: {
          [0]: {
            x: { $set: dataSelected?.x }
          }
        },
        yaxis: {
          [0]: {
            // y: { $set: dataSelected?.y },
            y: { $set: 450 },
            label: {
              text: {
                $set: (dataSelected?.y !== undefined && dataSelected?.x !== undefined)
                  ? `${dataSelected?.date}: (${(dataSelected.y)?.toFixed(1)} mm - ${Number(dataSelected.x).toFixed(2)} MMTon)`
                  : undefined
              }
            }
          },
          [1]: {
            y: { $set: dataSelected?.y},
            borderColor: { $set: dataSelected?.y ? selectedColor : 'transparent' },

            // label: {
            //   text: { $set: dataSelected?.date}
            // }
          }
        },
      }
    }));
  }, [dataSelected])


  useEffect(() => {
    setDataSerie((s) => $u(s, {
      [0]: { data: { $set: dataLine as serieData[] } },
      // [1]: { data: {$set: [
      //   {x: 3, y: 71.22},
      //   {x: 7, y: 71.22}
      // ]}}

    }));

  }, [dataLine])

  useEffect(() => {
    let mediciones: serieData[] = showMediciones
      ? dataMedicion as serieData[]
      : (dataMedicion as serieData[]).filter(medicion => medicion.usadoEnEntrenamiento === false)

    setDataSerie((s) => $u(s, {
      [1]: { data: { $set: mediciones } }
    }));
  }, [dataMedicion, showMediciones])


  return (
    <>
      <ReactApexChart
        options={dataGraph}
        series={dataSerie}
        height={"100%"}
        width={"100%"}
      />
    </>
  )
}

export default LineGraph