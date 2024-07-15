import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { $d, $j, $m } from '../../../Common/Utils/Reimports';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { BaseContentView } from '../../Common/BaseContentView';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { IComponente } from '../../../Data/Models/Componentes/Componentes';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { JumpLabel } from '../../../Components/Common/JumpLabel';

interface IColumnsTable {
  key: string;
  name: string;
  selector: string | ((row: any[], rowIndex: number) => ReactNode);
  format?: any;
}

export default function DataLake() {
  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  
  const [loadingData, setLoadingData] = useState(true);
  const [idEquipoSelected, setIdEquipoSelected] = useState<string | undefined>();
  const [nombreEquipoSelected, setNombreEquipoSelected] = useState<string | undefined>();
  const [tipoEquipoSelected, setTipoEquipoSelected] = useState<string | undefined>(undefined);
  const [idComponentSelected, setIdComponentSelected] = useState<string | undefined>(undefined);
  const [nombreComponentSelected, setNombreComponentSelected] = useState<string | undefined>(undefined);
  const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([]);
  const [fechaInicial, setFechaInicial] = useState<string | undefined>();
  const [fechaFinal, setFechaFinal] = useState<string | undefined>();
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [tableHeader, setTableHeader] = useState<IColumnsTable[]>([]);
  const [loadingDataTable, setLoadingDataTable] = useState(false);
  const [reloadTable, setReloadTable] = useState<boolean>(false);

  const updateComponentes = async (equipoId: string) => {
    setIdComponentSelected(undefined);
    setLoadingData(true);
    await ax.get<IComponente[]>('service_render/equipos/componentes_asignados', { params: { equipo_id: equipoId } })
      .then((response) => {
        setComponentsForTraining(response.data);
        setIdComponentSelected(response.data.length > 0 ? response.data[0].id : undefined);
        setNombreComponentSelected(response.data.length > 0 ? response.data[0].nombre : undefined);
      })
      .catch((e) => {
        if (e.response) {
          addToast(caps('errors:base.load', { element: 'componentes' }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        setLoadingData(false);
      });
  };

  const getDatosOperacionales = async () => {
    if (!fechaFinal) return; // No hacer nada si no hay fecha final
    setLoadingDataTable(true);
    const params = {
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected,
      fecha_inicial: fechaInicial,
      fecha_final: fechaFinal,
      downloadable: false
    };
    await ax.get($j('dataleake'), { params })
      .then((response) => {
        const columnsDataOperacional = response.data.header.map((name: string) => {
          return {
            key: name,
            name,
            selector: name
          };
        });
        setTableHeader(columnsDataOperacional);
        setTableData(response.data.data);
        setReloadTable(false); // Reset reloadTable here
      })
      .catch((e) => {
        if (e.response) {
          addToast('Error al consultar los datos operacionales', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        setLoadingDataTable(false);
      });
  };

  const downloadExcel = async () => {
    const equipoNombre = nombreEquipoSelected?.replace(/\s+/g, '_');
    const componentNombre = nombreComponentSelected?.replace(/\s+/g, '_');
    const nombreArchivo = `${equipoNombre}_${componentNombre}_${$m().format("YYYYMMDDHHmmss")}.xlsx`;
    const params = {
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected,
      fecha_inicial: fechaInicial,
      fecha_final: fechaFinal,
      downloadable: true
    };

    await ax.get($j('service_render', 'data_pi'), { responseType: "blob", params })
      .then((e) => {
        $d(e.data, nombreArchivo, e.headers["content-type"]);
      })
      .catch((error) => {
        let errorMessage = 'Error en la descarga';

        if (error.response && error.response.status === 500 && error.response.data instanceof Blob) {
          const reader = new FileReader();

          reader.onload = () => {
            try {
              const jsonResponse = JSON.parse(reader.result as string);
              errorMessage = jsonResponse.message;
            } catch (e) {
              errorMessage = 'Error al procesar el archivo descargado';
            }
          };
          reader.readAsText(error.response.data);
        }

        addToast(errorMessage, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
  };

  useEffect(() => {
    if (idEquipoSelected == undefined) { return; }
    updateComponentes(idEquipoSelected);
  }, [idEquipoSelected]);

  useEffect(() => {
    if (fechaInicial && fechaFinal && idComponentSelected) {
      setReloadTable(true);
    }
  }, [fechaInicial, fechaFinal, idComponentSelected]);

  useEffect(() => {
    if (reloadTable) {
      getDatosOperacionales();
    }
  }, [reloadTable]);

  return (
    <>
      <BaseContentView title='titles:data_lake'>
        <Row>
          <Col md={3}>
            <ApiSelect<EquipoTipo>
              label='Equipo'
              name='equipo_select'
              placeholder='Seleccione equipo'
              source={'service_render/equipos'}
              value={idEquipoSelected}
              selector={(option: EquipoTipo) => {
                return { label: option.nombre, value: option.id.toString(), tipo: option.equipo_tipo.nombre_corto };
              }}
              valueInObject={true}
              onChange={(data) => {
                setTipoEquipoSelected(data.tipo);
                setIdEquipoSelected(data.value);
                setNombreEquipoSelected(data.label);
              }}
            />
          </Col>

          <Col md={3}>
            <ApiSelect<IComponente>
              name='componente'
              label='Componente'
              placeholder='Seleccione componente'
              source={componentsForTraining}
              value={idComponentSelected}
              selector={(option: IComponente) => {
                return { label: option.nombre, value: option.id.toString() };
              }}
              valueInObject={true}
              onChange={(data) => {
                setIdComponentSelected(data.value ?? data);
                data.label && setNombreComponentSelected(data.label);
              }}
              isLoading={loadingData}
              isDisabled={loadingData}
              errors={(componentsForTraining.length === 0 && !loadingData)
                ? ['El equipo seleccionado no tiene componentes entrenados'] : []}
            />
          </Col>

          {idComponentSelected && (
            <>
              <Col md={2}>
                <Datepicker
                  label='Fecha inicial'
                  value={fechaInicial}
                  onChange={(date) => { 
                    setFechaInicial(date); 
                    setFechaFinal(undefined); // Reset fecha final cuando cambia fecha inicial
                  }}
                />
              </Col>
              <Col md={2}>
                <Datepicker
                  label='Fecha final'
                  value={fechaFinal}
                  minDate={fechaInicial} // No permitir seleccionar una fecha menor a la inicial
                  onChange={(date) => { 
                    setFechaFinal(date); 
                    setReloadTable(true);
                  }}
                  disabled={!fechaInicial} // Deshabilitar fecha final si no hay fecha inicial
                />
              </Col>
            </>
          )}

          <Col md={2} className="pt-2">
            <JumpLabel />
            <Button
              onClick={downloadExcel}
              disabled={loadingData || componentsForTraining.length === 0 || tableData.length === 0}
              className="w-100 d-flex justify-content-center align-items-center">
              <i className={'mx-2 fas fa-file-download fa-lg'} />
              <span className='mx-2'>Descargar</span>
            </Button>
          </Col>
        </Row>

        <Col sm={12} className='mt-3'>
          <ApiTable
            columns={tableHeader}
            source={tableData}
            reload={reloadTable}
            isLoading={loadingDataTable}
            className='my-custom-datatable'
          />
        </Col>
      </BaseContentView>
    </>
  );
}
