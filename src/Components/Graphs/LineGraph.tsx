import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { $m, $u } from '../../Common/Utils/Reimports';
import { YAxis } from 'recharts';

interface ILineGraph {
  data: ApexAxisChartSeries
  timestamps: string[]
  dataSelected: {
    x?: number | string
    y?: null | number
    date?: string
  }
}

function LineGraph({ data, dataSelected }: ILineGraph) {
  const primaryColor = '#2962ff'
  const [dataGraph, setDataGraph] = useState<ApexOptions>({
    chart: {
      type: "line",
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
      title: {
        text: 'Tonelaje procesado acumulado [MTon]',
        style: {
          fontSize: '11px',
          fontWeight: 600,
          color: primaryColor
        }
      },
      axisTicks: {
        show: true,
        height: 12,
      },
      axisBorder: {
        show: true,
        offsetX: 0,
        offsetY: 0
      },
      labels: {
        minHeight: 50,
        offsetY: 4,
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
      yaxis: [
        {
          y: undefined,
          borderColor: '#fd4761',
          label: {
            offsetX: -8,
            offsetY: -5,
            position: 'right',
            borderColor: 'transparent',
            style: {
              color: '#fd4761',
              background: 'transparent',
            },
            text: undefined,
          }
        },
        {
          y: undefined,
          borderColor: '#fd4761',
          label: {
            offsetX: -8,
            offsetY: 20,
            position: 'right',
            borderColor: '#fd4761',
            style: {
              color: '#fff',
              background: '#fd4761',
            },
            text: undefined,
          }
        }
      ],
      xaxis: [
        {
          x: undefined,
          borderColor: '#fd4761',
        }
      ],
      points:
        [
          {
            x: undefined,
            y: undefined,
            marker: {
              size: 4,
              fillColor: "#fff",
              strokeColor: "#fd4761",
            }
          }
        ]
    },

    dataLabels: {
      enabled: false
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
    markers: {
      size: 0,
      hover: {
        size: 0,
      }
    },
  });

  useEffect(() => {
    setDataGraph({ ...dataGraph, series: data })
    setDataGraph((s) => $u(s, {
      annotations: {
        points: {
          [0]: {
            x: { $set: dataSelected.x },
            y: { $set: dataSelected.y }
          }
        },
        xaxis:{
          [0]: {
            x: { $set: dataSelected.x }
          }
        },
        yaxis:{
          [0]: {
            y: { $set: dataSelected.y },
            label: {
              text: {$set: `${dataSelected.x} mm - ${dataSelected.y} MTon` }
            }
          },
          [1]: {
            y: { $set: dataSelected.y },
            label: {
              text: {$set: dataSelected.date }
            }
          }
        },
      }
    }));
  }, [dataSelected])


  return (
    <>
      <ReactApexChart
        options={dataGraph}
        series={data}
        height={"100%"}
        width={"100%"}
      />
    </>
  )
}

export default LineGraph