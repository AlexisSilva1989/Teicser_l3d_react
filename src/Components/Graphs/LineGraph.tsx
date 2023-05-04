import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { $m, $u } from '../../Common/Utils/Reimports';
import { YAxis } from 'recharts';

interface ILineGraph {
  title: string
  data: ApexAxisChartSeries
  timestamps: string[]
  dataSelected: {
    x?: number | string
    y?: null | number
    date?: string
  }
}

function LineGraph({ data, dataSelected, title }: ILineGraph) {
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
      tickAmount: 6,
      title: {
        text: 'Tonelaje procesado acumulado [MTon]',
        offsetY: -14,
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
        // minHeight: 25,
        offsetY: 12,
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
      // xaxis: [
      //   {
      //     x: undefined,
      //     strokeDashArray: 2,
      //     borderColor: '#fd4761',
      //   }
      // ],
      yaxis: [
        {
          y: undefined,
          borderColor: 'transparent',
          label: {
            offsetX: -8,
            offsetY: -8,
            position: 'right',
            borderColor: 'transparent',
            style: {
              color: '#fd4761',
              background: '#fff',
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
            offsetY: 22,
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
    title: {
      text: undefined,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#263238'
      },
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
    // setDataGraph({ ...dataGraph, series: data })

    setDataGraph((s) => $u(s, {
      title: {
        text: { $set: title }
      },
      annotations: {
        points: {
          [0]: {
            x: { $set: dataSelected?.x },
            y: { $set: dataSelected?.y }
          }
        },
        // xaxis: {
        //   [0]: {
        //     x: { $set: dataSelected.x }
        //   }
        // },
        yaxis: {
          [0]: {
            y: { $set: dataSelected?.y },
            label: {
              text: {
                $set: (dataSelected?.y !== undefined && dataSelected?.x !== undefined)
                  ? `${dataSelected.y} mm - ${dataSelected.x} MTon`
                  : undefined
              }
            }
          },
          [1]: {
            y: { $set: dataSelected?.y},
            borderColor: { $set: dataSelected?.y ? '#fd4761' : 'transparent' },

            label: {
              text: { $set: dataSelected?.date}
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