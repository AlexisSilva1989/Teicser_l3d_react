import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { ApiTable } from '../../../Components/Api/ApiTable'
import { SearchBar } from '../../../Components/Forms/SearchBar'
import { useSearch } from '../../../Common/Hooks/useSearch'
import { useFullIntl } from '../../../Common/Hooks/useFullIntl'
import { $j, $u } from '../../../Common/Utils/Reimports'
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner'
import { IPlanosComponentes, IPlanosComponentesColumnView } from '../../../Data/Models/Binnacle/PlanosComponentes'
import { ax } from '../../../Common/Utils/AxiosCustom'
import { useDashboard } from '../../../Common/Hooks/useDashboard'
import { ApiSelect } from '../../../Components/Api/ApiSelect'
import { IComponente } from '../../../Data/Models/Componentes/Componentes'
import { useToasts } from 'react-toast-notifications'
import { AxiosError } from 'axios'
import { JumpLabel } from '../../../Components/Common/JumpLabel'

interface IPlanosAntiguosProps {
  idEquipo: string | undefined
}


const PlanosAntiguos = ({
  idEquipo
}: IPlanosAntiguosProps) => {

  const [search, doSearch] = useSearch();
  const { setLoading } = useDashboard();
	const { addToast } = useToasts();
  const { intl, capitalize: caps } = useFullIntl();

  //states
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined
    filterByComponente: string | undefined
  }>({
    filterByEquipo: undefined,
    filterByComponente: undefined
  })
  const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([])

  //Effects 
  useEffect(() => {
    setFiltersParams(state => $u(state, { filterByEquipo: { $set: idEquipo } }))
    updateComponentes(idEquipo);
  }, [idEquipo])

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

  const updateComponentes = async (equipoId: string | undefined) => {

    await ax.get<IComponente[]>('service_render/equipos/componentes_asignados', { params: { equipo_id: equipoId } })
      .then((response) => {
        setComponentsForTraining(response.data);
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.load', { element: "componentes" }), {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      });
  }

  return (<>
    <Col sm={12} className="d-flex justify-content-end align-items-end px-0 pb-4">
      <Col sm={3} xs={12}>
        <ApiSelect<IComponente>
          name='componente'
          label='Componente'
          placeholder='Seleccione componente'
          className='mb-0'
          source={componentsForTraining}
          value={filtersParams.filterByComponente == undefined ? '-1' : filtersParams.filterByComponente}
          selector={(option: IComponente) => {
            return { label: option.nombre, value: option.id.toString() };
          }}
          onChange={(data) => {
            setFiltersParams(state => $u(state, { filterByComponente: { $set: data != '-1' ? data : undefined } }))
          }}
          firtsOptions={{ label: 'TODOS', value: '-1' }}
        // isLoading={loadingData}
        // isDisabled={loadingData}
        />
      </Col>
      <div className="col-lg-3 col-md-5 col-sm-6">
        <SearchBar onChange={doSearch} outerClassName='mb-0'/>
      </div>
    </Col>
    <Col sm={12} className=' px-0'>
      {filtersParams.filterByEquipo === undefined ?
        <LoadingSpinner /> :
        <ApiTable<IPlanosComponentes>
          columns={IPlanosComponentesColumnView(intl, { verPDF })}
          source={"planos_componentes"}
          paginationServe={true}
          filterServeParams={filtersParams}
          search={search}
        />
      }
    </Col>

  </>
  )
}

export default PlanosAntiguos 