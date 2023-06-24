import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { $m, $u } from '../../Common/Utils/Reimports';
import { YAxis } from 'recharts';

interface serieData  {
  x: any;
  y: any;
  fillColor?: string | undefined;
  strokeColor?: string | undefined;
  meta?: any;
  goals?: any;
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
  }
}



function LineGraph({ dataLine, dataMedicion, dataSelected, title , fecha_medicion }: ILineGraph) {
  const primaryColor = '#0D47A1'
  const selectedColor = '#004D40'
  const [dataSerie, setDataSerie] = useState<{name?: string, color?: string, type: string, data:serieData[]}[]>(
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
          const valueFormat = value % 1 === 0 ? val : value.toFixed(2)
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
      enabled: false
    },
    legend: {
      show: false
    },
    markers: {
      size: [0, 4],
      strokeWidth: 0
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
                  ? `${dataSelected?.date}: (${dataSelected.y} mm - ${dataSelected.x} MMTon)`
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
    setDataGraph((s) => $u(s, {
      xaxis: {max: {$set: (dataLine.length > 0) ? Number((dataLine[dataLine.length-1] as serieData).x) : 100}}
    }))
    setDataSerie((s) => $u(s, {
      [0]: {data: {$set: dataLine as serieData[]}},
      // [1]: { data: {$set: [
      //   {x: 3, y: 71.22},
      //   {x: 7, y: 71.22}
      // ]}}

    }));

  }, [dataLine])

  useEffect(() => {
    console.log('dataMedicion: ', dataMedicion);
    setDataSerie((s) => $u(s, {
      [1]: { data: {$set: dataMedicion as serieData[]}}
    }));
  }, [dataMedicion])
  

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