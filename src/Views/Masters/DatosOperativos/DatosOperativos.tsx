import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios';
import { Alert, Button, Col, Modal, Tab, Tabs } from 'react-bootstrap';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { $d, $j, $m, $u, $x } from '../../../Common/Utils/Reimports';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { BaseContentView } from '../../Common/BaseContentView';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { IComponente } from '../../../Data/Models/Componentes/Componentes';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { JumpLabel } from '../../../Components/Common/JumpLabel';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { FileInputWithDescription } from '../../../Components/Forms/FileInputWithDescription';
import { useReload } from '../../../Common/Hooks/useReload';
import { DateUtils } from '../../../Common/Utils/DateUtils';
import { CampaniasColumns, ICampania } from '../../../Data/Models/Campanias/Campanias';
import { IDataTableConditionalRowStyles } from 'react-data-table-component';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { IParametrosReferencias } from '../../../Data/Models/ParametrosReferencias/ParametrosReferencias';
import FormParametrosReferenciales from '../../../Components/views/Home/Equipos/FormParametrosReferenciales';

interface IColumnsTable {
  key: string
  name: string
  selector: string | ((row: any[], rowIndex: number) => ReactNode)
  format?: any
}

export default function DatosOperativos() {
  const { capitalize: caps } = useFullIntl()
  const { setLoading } = useDashboard()
  const { addToast } = useToasts()

  const [reloadTableDataOp, doReloadTableDataOp] = useReload();
  const [reloadTableImportDataOp, doReloadTableImportDataOp] = useReload();
  const [reloadTableImportDataProfiles, doReloadTableImportDataProfiles] = useReload();
  const [reloadTableImportDataCampaigns, doReloadTableImportDataCampaigns] = useReload();
  const [reloadTableCampainsEquipo, doReloadTableCampainsEquipo] = useReload();

  // const modalImportDataOperational = useShortModal()
  // const modalImportProfiles = useShortModal()
  // const modalImportCampaigns = useShortModal()
  const modalConfigEquipo = useShortModal()

  //STATES
  const [loadingData, setLoadingData] = useState(true)
  const [idEquipoSelected, setIdEquipoSelected] = useState<string | undefined>()
  const [nombreEquipoSelected, setNombreEquipoSelected] = useState<string | undefined>()
  const [tipoEquipoSelected, setTipoEquipoSelected] = useState<string | undefined>(undefined)
  const [idComponentSelected, setIdComponentSelected] = useState<string | undefined>(undefined)
  const [nombreComponentSelected, setNombreComponentSelected] = useState<string | undefined>(undefined)
  const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([])
  const [campainsEquipo, setCampainsEquipo] = useState<ICampania[]>([])
  const [loadingCampainsEquipo, setLoadingCampainsEquipo] = useState<boolean>(false)
  const [loadingParametrosReferenciales, setLoadingParametrosReferenciales] = useState<boolean>(false)
  const [loadingDataOp, setLoadingDataOp] = useState<boolean>(false)

  const [displayFileOp, setDisplayFileOp] = useState<string>()
  const [displayFileProfiles, setDisplayFileProfiles] = useState<string>()
  const [displayFileCampaigns, setDisplayFileCampaigns] = useState<string>()

  const [fileOp, setFileOp] = useState<File | null>(null)
  const [fileProfiles, setFileProfiles] = useState<File | null>(null)
  const [fileCampaigns, setFileCampaigns] = useState<File | null>(null)


  const [tableDataOp, setTableDataOp] = useState<Array<Array<any>>>([])
  const [tableImportDataOp, setTableImportDataOp] = useState<Array<Array<any>>>([])
  const [tableImportDataProfiles, setTableImportDataProfiles] = useState<Array<Array<any>>>([])
  const [tableImportDataCampaigns, setTableImportDataCampaigns] = useState<any[][]>([])
  const [headerTableImportDataOp, setHeaderTableImportDataOp] = useState<IColumnsTable[]>([])
  const [headerTableImportDataProfiles, setHeaderTableImportDataProfiles] = useState<IColumnsTable[]>([])
  const [headerTableImportDataCampaigns, setHeaderTableImportDataCampaigns] = useState<IColumnsTable[]>([])
  const [headerTableDataOp, setHeaderTableDataOp] = useState<IColumnsTable[]>([])

  const [ErrorEstructuraCampaign, setIsErrorEstructuraCampaign] = useState<string | undefined>(undefined)
  const [IsOpenCampaign, setIsOpenCampaign] = useState<boolean>(false)
  const [LastCampaign, setLastCampaign] = useState<ICampania | undefined>({
    numero_camp: undefined,
    fecha_fin: undefined,
    fecha_inicio: undefined
  })
  const [selectedCampaingsFromPol, setSelectedCampaingsFromPol] = useState<number[]>([])
  const [selectedCampaingsFromIa, setSelectedCampaingsFromIa] = useState<number[]>([])
  const [isAddFromIaPol, setIsAddFromIaPol] = useState<boolean>(false)
  const [equipoParametros, setEquipoParametros] = useState<IParametrosReferencias | undefined>(undefined)
  const [isSavingParametros, setIsSavingParametros] = useState<boolean>(false)


  //HANDLES

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
        setLoadingData(false);
      });
  }

  //DESCARGAR DATA OPERACIONAL
  const downloadExcel = async () => {
    const equipoNombre = nombreEquipoSelected?.replace(/\s+/g, '_')
    setLoading(true);
    const componentNombre = nombreComponentSelected?.replace(/\s+/g, '_')
    const nombreArchivo = `${equipoNombre}_${componentNombre}_${$m().format("YYYYMMDDHHmmss")}.xlsx`
    const params = {
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected,
      downloadable: true
    }

    await ax.get($j('service_render', 'data_pi'), { responseType: "blob", params })
      .then((e: AxiosResponse) => {
        $d(e.data, nombreArchivo, e.headers["content-type"]);
      })
      .catch(async (error: AxiosError) => {
        let errorMessage: string | Promise<string> = 'Error en la descarga';

        if (error.response && error.response.status === 500 && error.response.data instanceof Blob) {
          const reader = new FileReader();

          errorMessage = new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              try {
                const jsonResponse = JSON.parse(reader.result as string);
                resolve(jsonResponse.message);
              } catch (e) {
                reject(e);
              }
            };
            reader.onerror = reject;
            reader.readAsText(error.response?.data);
          });
        }

        addToast(await errorMessage, {
          appearance: 'error',
          autoDismiss: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  //ENVIAR AL SERVIDOR ARCHIVO DE DATA OPERACIONAL
  const uploadExcelDataOp = async () => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    fileOp !== null && formData.append('vars_op', fileOp);
    idEquipoSelected !== undefined && formData.append('equipoId', idEquipoSelected);

    setLoading(true);
    modalConfigEquipo.hide()
    await ax.post("service_render/data_pi/update", formData, headers)
      .then((response) => {
        addToast(response.data?.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        setTableImportDataOp([])
        setFileOp(null)
        setDisplayFileOp(undefined)
      })
      .catch((error) => {

        addToast(error.response?.data?.message || 'Error en la actualización', {
          appearance: 'error',
          autoDismiss: true,
        });
      })
      .finally(() => {
        getDatosOperacionales()
        setLoading(false);
      });
  };

  //ENVIAR AL SERVIDOR ARCHIVO DE PERFILES
  const uploadExcelDataProfiles = async () => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    fileProfiles !== null && formData.append('profile', fileProfiles);
    idEquipoSelected !== undefined && formData.append('equipoId', idEquipoSelected);
    idComponentSelected !== undefined && formData.append('componenteId', idComponentSelected);

    setLoading(true);
    modalConfigEquipo.hide()
    await ax.post("service_render/data_pi/perfil", formData, headers)
      .then((response) => {
        response.data?.forEach((element: { status: AppearanceTypes, message: string }) => {
          addToast(element.message, {
            appearance: element.status,
            autoDismiss: true,
          });

        });

        setTableImportDataProfiles([])
        setFileProfiles(null)
        setDisplayFileProfiles(undefined)
      })
      .catch((error) => {
        addToast(error.response?.data?.message || 'Error en la actualización', {
          appearance: 'error',
          autoDismiss: true,
        });
      })
      .finally(() => {
        getDatosOperacionales()
        setLoading(false);
      });
  };

  //ENVIAR AL SERVIDOR ARCHIVO DE CAMPAÑAS
  const uploadExcelDataCampaigns = async () => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };

    fileCampaigns !== null && formData.append('campains', fileCampaigns);
    idEquipoSelected !== undefined && formData.append('equipoId', idEquipoSelected);
    idComponentSelected !== undefined && formData.append('componenteId', idComponentSelected);

    setLoading(true);
    modalConfigEquipo.hide()
    await ax.post("service_render/campains", formData, headers)
      .then((response) => {
        addToast(response.data?.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        setTableImportDataCampaigns([])
        setFileCampaigns(null)
        setDisplayFileCampaigns(undefined)
      })
      .catch((error) => {
        addToast(error.response?.data?.message || 'Error en la actualización', {
          appearance: 'error',
          autoDismiss: true,
        });
      })
      .finally(() => {
        getDatosOperacionales()
        setLoading(false);
      });
  };

  //ONCHANGE ARCHIVO DE DATA OPERACIONAL
  const handleChangeFileOp = async (file: File | null) => {
    if (!file) {
      setTableImportDataOp([])
      setFileOp(null)
      doReloadTableImportDataOp();
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = $x.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const tableData = $x.utils.sheet_to_json<Array<any>>(worksheet, { header: 1, blankrows: false });
      const headerRow = tableData[0];
      const columns = headerRow.map((name: string, index: number) => {
        return {
          key: name,
          name,
          selector: (row: any[]) => {
            if (name === 'TIMESTAMP') {
              const date = (row[index] && !isNaN(row[index]))
                ? DateUtils.excelToDate($x.SSF.parse_date_code(Math.round(row[index])))
                : row[index]
              return date
            }
            return row[index]
          }
        };
      });
      setTableImportDataOp(tableData.slice(1));
      setHeaderTableImportDataOp(columns);
      setFileOp(file)
      doReloadTableImportDataOp();
    };
    reader.readAsArrayBuffer(file);
  }

  //ONCHANGE ARCHIVO DE CAMPAÑAS
  const handleChangeFileCampaigns = async (file: File | null) => {
    if (!file) {
      setIsErrorEstructuraCampaign(undefined);
      setTableImportDataCampaigns([])
      setFileCampaigns(null)
      doReloadTableImportDataCampaigns();
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = $x.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const tableData = $x.utils.sheet_to_json<Array<any>>(worksheet, { header: 1, blankrows: false });
      const headerRow = tableData[0];

      const expectedKeys = ['CAMPAÑA', 'FECHA_INICIO', 'FECHA_FIN', 'POL', 'IA'];
      const isValidaEstructura = expectedKeys.length === headerRow.length
        && expectedKeys.every((val, index) => val === headerRow[index].toUpperCase());

      const dataFile = tableData.slice(1);

      if (isValidaEstructura) {
        const columns = headerRow.map((name: string, index: number) => {
          return {
            key: name,
            name,
            selector: (row: any[]) => {
              if (name === 'FECHA_INICIO' || name === 'FECHA_FIN') {
                const date = (row[index] && !isNaN(row[index]))
                  ? DateUtils.excelToDate($x.SSF.parse_date_code(Math.round(row[index])))
                  : row[index]
                return date
              }
              return row[index]
            }
          };
        });

        //VALIDAR QUE TODOS LOS REGISTROS ESTEN COMPLETOS 
        const totalColumnsValid = 5
        const columnFechaFin = 2
        let isValidData = true;
        dataFile.forEach((item, index) => {
          //SI NO TIENE LA MISMA CANTIDAD DE COLUMNAS DE LA ESTRUCTURA
          if (item.length !== totalColumnsValid) {
            isValidData = false
            return
          }

          const undefinedIndices = []
          //VERIFICAR SI INCLUYE UN REGISTRO UNDEFINED
          for (const [index, value] of item.entries()) {
            if (value === undefined) {
              undefinedIndices.push(index)
            }
          }

          if (index !== dataFile.length - 1) {
            if (undefinedIndices.length > 0) {
              isValidData = false
              return
            }
          } else {
            if (undefinedIndices.length > 1) {
              isValidData = false
              return
            }

            if (undefinedIndices.length === 1 && undefinedIndices[0] !== columnFechaFin) {
              isValidData = false
              return
            }
          }

        });
        setIsErrorEstructuraCampaign(isValidData
          ? undefined
          : "Error, se han detectados campañas con formato incorrecto, recuerde que solo la última campaña puede quedar abierta"
        );
        setHeaderTableImportDataCampaigns(columns);
        setTableImportDataCampaigns(dataFile);
        setFileCampaigns(file)
      } else {
        setIsErrorEstructuraCampaign(
          "Error en la estructura del archivo cargado, la estructura debe ser [CAMPAÑA, FECHA_INICIO, FECHA_FIN, POL, IA]"
        );
        setHeaderTableImportDataCampaigns([]);
        setTableImportDataCampaigns([])
        setFileCampaigns(null)
      }

      doReloadTableImportDataCampaigns();
    };
    reader.readAsArrayBuffer(file);
  }

  //ONCHANGE ARCHIVO DE PERFILES
  const handleChangeFileProfiles = async (file: File | null) => {
    if (!file) {
      setTableImportDataProfiles([])
      setFileProfiles(null)
      doReloadTableImportDataProfiles();
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = $x.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const tableData = $x.utils.sheet_to_json<Array<any>>(worksheet, { header: 1, blankrows: false });
      const headerRow = tableData[0];
      const columns = headerRow.map((name: string, index: number) => {
        return {
          key: name,
          name: name === 'TIMESTAMP' || name === 'FECHA' ? name : `${name} (X_${index - 1})`,
          selector: (row: any[]) => {
            if (name === 'TIMESTAMP' || name === 'FECHA') {
              const date = (row[index] && !isNaN(row[index]))
                ? DateUtils.excelToDate($x.SSF.parse_date_code(Math.round(row[index])))
                : row[index]
              return date
            }
            return row[index]
          }
        };
      });
      setTableImportDataProfiles(tableData.slice(1));
      setHeaderTableImportDataProfiles(columns);
      setFileProfiles(file)
      doReloadTableImportDataProfiles();
    };
    reader.readAsArrayBuffer(file);
  }

  //BUSCAR CAMPAÑAS DE EQUIPO
  const getDataEquipo = async (selectedTab: string | null) => {

    if (selectedTab === 'viewCampaigns') {
      setLoadingCampainsEquipo(true)
      await ax.get<ICampania[]>('service_render/campains', {
        params: {
          equipoId: idEquipoSelected,
          componenteId: idComponentSelected
        }
      })
        .then((response) => {
          setCampainsEquipo(response.data);
          const isOpenCamp = response.data.length > 0 && response.data[0].fecha_fin === null
          setIsOpenCampaign(isOpenCamp)
          let dataLastCampaign: ICampania | undefined
          if (response.data.length > 0) {
            dataLastCampaign = { ...response.data[0] }
            if (isOpenCamp) {
              dataLastCampaign.fecha_inicio = $m(response.data[0].fecha_inicio).format('DD-MM-YYYY')
              dataLastCampaign.fecha_fin = $m(response.data[0].fecha_inicio).format('DD-MM-YYYY')
            } else {
              dataLastCampaign.fecha_inicio = undefined
              dataLastCampaign.fecha_fin = undefined
            }
          } else {
            dataLastCampaign = {
              numero_camp: undefined,
              fecha_inicio: undefined,
              fecha_fin: undefined
            }
          }
          setLastCampaign(dataLastCampaign)
          setSelectedCampaingsFromPol(
            response.data.filter(item => item.pol).map(item => item.numero_camp) as number[]
          );

          setSelectedCampaingsFromIa(
            response.data.filter(item => item.ia).map(item => item.numero_camp) as number[]
          );
          doReloadTableCampainsEquipo()
        })
        .catch((e: AxiosError) => {
          if (e.response) {
            addToast("Error al cargar campañas", {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        }).finally(() => {
          setLoadingCampainsEquipo(false)
        });
    }

    if (selectedTab === 'viewParametros') {
      setLoadingParametrosReferenciales(true)
      await ax.get<IParametrosReferencias>('service_render/parametros_referencia', {
        params: {
          equipoId: idEquipoSelected,
          componenteId: idComponentSelected
        }
      })
        .then((response) => {
          setEquipoParametros(response?.data)
        })
        .catch((e: AxiosError) => {
          if (e.response) {
            addToast("Error al cargar parametros", {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        }).finally(() => {
          setLoadingParametrosReferenciales(false)
        });
    }
  };

  //BUSCAR CAMPAÑAS DE EQUIPO
  const getDatosOperacionales = async () => {
    setLoadingDataOp(true)
    const params = {
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected,
      downloadable: false
    }
    await ax.get($j('service_render', 'data_pi'), { params })
      .then((response) => {
        const columnsDataOperacional = response.data.header.map((name: string, index: number) => {
          return {
            key: name,
            name,
            selector: name
          };
        })
        setHeaderTableDataOp(columnsDataOperacional)
        setTableDataOp(response.data.data)
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast("Error al consultar los datos operacionales", {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        setLoadingDataOp(false)
        doReloadTableDataOp()
      });
  };

  //GUARDAR CAMPAÑA
  const saveDataCampaign = async () => {
    setLoadingCampainsEquipo(true)
    await ax.post<ICampania[]>('service_render/campains/single', {
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected,
      campaign: LastCampaign,
      update: IsOpenCampaign
    })
      .then((response) => {
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast("No se pudo cargar datos de la campaña", {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        getDataEquipo('viewCampaigns')
        getDatosOperacionales()
      });
  }

  //EJECUTAR PROYECCION
  const ejecutarProyeccion = async () => {
    setLoading(true);
    await ax.post('service_render/proyeccion_pl', {
      equipoId: idEquipoSelected,
      componenteId: idComponentSelected
    })
      .then((response) => {
        addToast(response.data?.message, {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast("Ha ocurrido un error", {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        setLoading(false);
      });
  }

  //GUARDAR PARAMETROS
  const guardarParametrosReferenciales = async (data: IParametrosReferencias) => {
    setIsSavingParametros(true);
    await ax.post('service_render/parametros_referencia', data)
      .then((response) => {
        modalConfigEquipo.hide()

        addToast(response.data?.message, {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        modalConfigEquipo.hide()
        if (e.response) {
          addToast(e.response.data.errors
            ? e.response.data.errors[Object.keys(e.response.data.errors)[0]]
            : "Error al guardar la configuración",
            { appearance: 'error', autoDismiss: true }
          );
        }
      })
      .finally(() => {
        setIsSavingParametros(false)
      });
  };

  //EFFECTS
  /*OBTENER DATOS ASOCIADOS A LA PROYECCION */
  useEffect(() => {
    if (idEquipoSelected == undefined) { return }
    setLoadingData(true);
    updateComponentes(idEquipoSelected);
  }, [idEquipoSelected]);

  useEffect(() => {
    setHeaderTableDataOp([])
    setTableDataOp([])
    if (idComponentSelected == undefined) { return }
    getDatosOperacionales()
  }, [idComponentSelected]);

  //* ROWS STYLES
  const CampaignsRowStyle = useMemo(
    (): IDataTableConditionalRowStyles[] => [
      {
        when: (selected: string[]) => {
          if (Array.isArray(selected)) {
            return selected.length < 3
          } else {
            const value = selected as { fecha_fin: string | undefined }
            return value.fecha_fin === null
          }

        },
        style: { backgroundColor: "var(--success) !important" },
      },
    ],
    []
  );

  //SECCIONES DE LOS TABS DE CONFIG
  /*SECCION PARA ACTUALIZAR CAMPAÑAS DEL EQUIPO*/
  const importCampaignsElement: JSX.Element = <>
    <Col className='pt-4'>
      <p style={{ fontSize: "14px", fontWeight: 600 }}>Registro de campañas</p>
    </Col>
    <Col>
      <Tabs id="tabsCampaigns" defaultActiveKey='viewCampaigns' className='border rounded-top'
        onSelect={getDataEquipo} >
        <Tab eventKey='viewCampaigns' title={"Campañas actuales"} className='border border-top-0 rounded-bottom'>

          {!loadingCampainsEquipo && (
            <Col className='py-3 d-flex justify-content-end align-items-end' style={{ columnGap: '14px' }} >
              {!IsOpenCampaign && (<Datepicker
                label='Fecha inicio de campaña'
                value={LastCampaign?.fecha_inicio ? LastCampaign.fecha_inicio.toString() : undefined}
                maxDate={LastCampaign?.fecha_fin ? LastCampaign.fecha_fin.toString() : undefined}
                onChange={value => {
                  setLastCampaign(state => $u(state, { fecha_inicio: { $set: value } }))
                }}
              />)}
              <Datepicker
                label='Fecha fin de campaña'
                value={LastCampaign?.fecha_fin ? LastCampaign.fecha_fin.toString() : undefined}
                minDate={LastCampaign?.fecha_inicio ? LastCampaign.fecha_inicio.toString() : undefined}
                onChange={value => {
                  setLastCampaign(state => $u(state, { fecha_fin: { $set: value } }))
                }}
              />
              <Button style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }} className='mb-1'
                onClick={() => { saveDataCampaign() }}
                disabled={IsOpenCampaign ? !LastCampaign?.fecha_fin : !LastCampaign?.fecha_inicio}>
                <i className={'mx-2 fas fa-calendar-week fa-lg'} />
                <span className='mx-2' >{IsOpenCampaign ? 'Cerrar' : 'Agregar'}</span>
              </Button>
            </Col>)
          }

          <Col className='py-4'>
            <Col sm={12} hidden={!isAddFromIaPol} className='px-0'> <LoadingSpinner /> </Col>
            <Col sm={12} hidden={isAddFromIaPol} className='px-0'>
              <ApiTable<ICampania>
                columns={CampaniasColumns(selectedCampaingsFromPol, selectedCampaingsFromIa, setIsAddFromIaPol)}
                source={campainsEquipo}
                reload={reloadTableCampainsEquipo}
                isLoading={loadingCampainsEquipo}
                className="my-custom-datatable"
                rowStyles={CampaignsRowStyle}
              />
            </Col>
          </Col>
        </Tab>
        <Tab eventKey='uploadCampaigns' title={"Actualizar campañas"} className='border border-top-0 rounded-bottom'>
          <Col className='py-4'>
            <Col className='d-flex justify-content-start align-items-center px-0'>
              <FileInputWithDescription
                label='Excel con campañas'
                id={"inputDataCampigns"}
                onChange={handleChangeFileCampaigns}
                onChangeDisplay={(display) => {
                  setDisplayFileCampaigns(state => $u(state, { $set: display }))
                }}
                display={displayFileCampaigns}
                accept={["xlsx", "xls", "csv"]}
              />
            </Col>

            <Col sm={12} className="mt-3 px-0">
              <ApiTable
                columns={headerTableImportDataCampaigns}
                source={tableImportDataCampaigns}
                reload={reloadTableImportDataCampaigns}
                className="my-custom-datatable"
                rowStyles={CampaignsRowStyle}
              />
            </Col>

            <Col sm={12} className="mt-3 px-0">
              <Alert variant="danger">
                <Alert.Heading><i className={'mx-2 fas fa-exclamation-triangle fa-lg'} />Acción irreversible!</Alert.Heading>
                <hr />
                <p className="mb-0">
                  Las campañas del componente {nombreComponentSelected} del equipo {nombreEquipoSelected} serán sustituidas por las campañas cargadas en el archivo.
                </p>
              </Alert>
            </Col>

            <Col className='pt-3 d-flex justify-content-end align-items-center '>
              <Button className="d-flex justify-content-center align-items-center"
                onClick={() => { uploadExcelDataCampaigns() }}
                disabled={tableImportDataCampaigns.length === 0 || !idComponentSelected || ErrorEstructuraCampaign !== undefined}>
                <i className={'mx-2 fas fa-file-upload fa-lg'} />
                <span className='mx-2' >Actualizar campañas de {nombreEquipoSelected}</span>
              </Button>
            </Col>
            <Col hidden={!ErrorEstructuraCampaign} className='px-0 pt-2 text-right'>
              <span className='text-danger' key="msg-error-campaign">
                {ErrorEstructuraCampaign}
              </span>
            </Col>
          </Col>
        </Tab>

      </Tabs>
    </Col>

  </>

  /*ELEMENTO PARA ACTUALIZAR PERFILES DEL EQUIPO*/
  const importProfilesElement: JSX.Element = <>
    <Col className='px-0 py-4'>
      <Col>
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Actualizar Mediciones</p>
      </Col>
      <Col className='d-flex justify-content-start align-items-center '>
        <FileInputWithDescription
          label='Archivo con espesores'
          id={"inputDataProfiles"}
          onChange={handleChangeFileProfiles}
          onChangeDisplay={(display) => {
            setDisplayFileProfiles(state => $u(state, { $set: display }))
          }}
          display={displayFileProfiles}
          accept={["xlsx", "xls", "csv"]}
        />
      </Col>

      <Col sm={12} className="mt-3">
        <ApiTable
          columns={headerTableImportDataProfiles}
          source={tableImportDataProfiles}
          reload={reloadTableImportDataProfiles}
        />
      </Col>
      <Col sm={12} className="mt-3">
        <Alert variant="danger">
          <Alert.Heading><i className={'mx-2 fas fa-exclamation-triangle fa-lg'} />  Acción irreversible!</Alert.Heading>
          <hr />
          <p className="mb-0">
            Los espesores del componente {nombreComponentSelected} para el equipo {nombreEquipoSelected} serán sustituidos por los espesores cargados en el archivo.
          </p>
        </Alert>
      </Col>
      <Col className='pt-3 d-flex justify-content-end align-items-center '>
        <Button className="d-flex justify-content-center align-items-center"
          onClick={() => { uploadExcelDataProfiles() }}
          disabled={!idComponentSelected || tableImportDataProfiles.length === 0}>
          <i className={'mx-2 fas fa-file-upload fa-lg'} />
          <span className='mx-2' >Actualizar espesores</span>
        </Button>
      </Col>
    </Col>
  </>

  /*ELEMENTO ACTUALIZAR LOS DATOS OPERACIONALES */
  const importDataOperationalElement: JSX.Element = <>
    <Col className='px-0 py-4'>
      <Col>
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Actualizar datos operacionales del equipo {nombreEquipoSelected}</p>
      </Col>
      <Col className='px-0'>
        <Col className='d-flex justify-content-start align-items-center '>
          <FileInputWithDescription
            label='Archivo con variables operacionales'
            id={"inputDataOp"}
            onChange={handleChangeFileOp}
            onChangeDisplay={(display) => {
              setDisplayFileOp(state => $u(state, { $set: display }))
            }}
            display={displayFileOp}
            accept={["xlsx", "xls", "csv"]}
          />
        </Col>
        <Col sm={12} className="mt-3">
          <ApiTable
            columns={headerTableImportDataOp}
            source={tableImportDataOp}
            reload={reloadTableImportDataOp}
          />
        </Col>
        <Col sm={12} className="mt-3">
          <Alert variant="danger">
            <Alert.Heading> <i className={'mx-2 fas fa-exclamation-triangle fa-lg'} /> Acción irreversible!</Alert.Heading>
            <hr />
            <p className="mb-0">
              Los datos operacionales del equipo {nombreEquipoSelected} serán sustituidos por los datos de las variables en el archivo.
            </p>
          </Alert>
        </Col>
        <Col className='pt-3 d-flex justify-content-end align-items-center '>
          <Button className="d-flex justify-content-center align-items-center"
            onClick={() => { uploadExcelDataOp() }} disabled={tableImportDataOp.length === 0}>
            <i className={'mx-2 fas fa-file-upload fa-lg'} />
            <span className='mx-2' >Actualizar {nombreEquipoSelected}</span>
          </Button>
        </Col>
      </Col>
    </Col>
  </>

  /*ELEMENTO ACTUALIZAR LOS PARAMETROS REFERENCIALES */
  const paramsElement: JSX.Element = <>
    <Col className='px-0 py-4'>
      <Col>
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Configuración de parámetros </p>
      </Col>
      <Col>
        {
          loadingParametrosReferenciales
            ? <LoadingSpinner />
            : <FormParametrosReferenciales
              onSubmit={guardarParametrosReferenciales}
              isSaving={isSavingParametros}
              initialData={equipoParametros}
            />
        }
      </Col>
    </Col>
  </>


  /*MODAL PARA ACTUALIZAR LOS DATOS OPERACIONALES */
  const modalConfigEquipoElement: JSX.Element = <>
    <Modal size='xl' show={modalConfigEquipo.visible} onHide={modalConfigEquipo.hide} onShow={() => getDataEquipo('viewCampaigns')}>
      <Modal.Header closeButton>
        <b> Configuración: {nombreEquipoSelected} / {nombreComponentSelected} </b>
      </Modal.Header>
      <Modal.Body>
        <Tabs id="tabsConfig" defaultActiveKey='viewCampaigns' className='border rounded-top' onSelect={getDataEquipo}>

          <Tab eventKey='viewCampaigns'
            title={<><i className={'mx-2 fas fa-calendar-week'} /> Campañas </>}
            className='border border-top-0 rounded-bottom'>
            {importCampaignsElement}
          </Tab>

          <Tab eventKey='viewPerfiles'
            title={<><i className={'mx-2 fas fa-ruler'} /> Mediciones </>}
            className='border border-top-0 rounded-bottom'>
            {importProfilesElement}
          </Tab>

          <Tab eventKey='viewImportar'
            title={<><i className={'mx-2 fas fa-file-upload'} /> Importar </>}
            className='border border-top-0 rounded-bottom'>
            {importDataOperationalElement}
          </Tab>

          <Tab eventKey='viewParametros'
            title={<><i className={'mx-2 fas fa-cog'} /> Parametros </>}
            className='border border-top-0 rounded-bottom'>
            {paramsElement}
          </Tab>

        </Tabs>
      </Modal.Body>
    </Modal>
  </>
  return (
    <>
      <BaseContentView title='titles:data_op'>
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
              setTipoEquipoSelected(data.tipo)
              setIdEquipoSelected(data.value)
              setNombreEquipoSelected(data.label)
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
              setIdComponentSelected(data.value ?? data)
              data.label && setNombreComponentSelected(data.label)
            }}
            isLoading={loadingData}
            isDisabled={loadingData}
            errors={(componentsForTraining.length === 0 && !loadingData)
              ? ['El equipo seleccionado no tiene componentes entrenados'] : []}
          />
        </Col>

        <Col xl={6} className="px-0 d-sm-flex justify-content-end align-items-start" >

          <Col sm={3} className="pt-2">
            <JumpLabel />
            <Button variant="outline-primary"
              disabled={!idComponentSelected}
              onClick={() => { ejecutarProyeccion() }}
              className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
              <i className={'mx-2 fas fa-play fa-lg'} />
              <span className='mx-2' >Proyectar</span>
            </Button>
          </Col>

          <Col sm={3} className="pt-2">
            <JumpLabel />
            <Button variant="outline-primary"
              disabled={!idComponentSelected}
              onClick={() => { modalConfigEquipo.show() }}
              className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
              <i className={'mx-2 fas fa-cogs fa-lg'} />
              <span className='mx-2' >Configuración</span>
            </Button>
          </Col>

          <Col sm={3} className="pt-2">
            <JumpLabel />
            <Button className="w-100 d-flex justify-content-center align-items-center"
              onClick={() => { downloadExcel() }}
              disabled={loadingData || componentsForTraining.length === 0 || tableDataOp.length === 0}>
              <i className={'mx-2 fas fa-file-download fa-lg'} />
              <span className='mx-2' >Descargar</span>
            </Button>
          </Col>
        </Col>

        <Col sm={12} className="mt-3">
          <ApiTable
            columns={headerTableDataOp}
            source={tableDataOp}
            reload={reloadTableDataOp}
            isLoading={loadingDataOp}
            className="my-custom-datatable"
          // pagination={false}
          />
        </Col>

        {modalConfigEquipoElement}
      </BaseContentView>
    </>

  )
}
