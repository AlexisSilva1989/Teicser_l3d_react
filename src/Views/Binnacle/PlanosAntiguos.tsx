import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { ApiTable } from '../../Components/Api/ApiTable'
import { SearchBar } from '../../Components/Forms/SearchBar'
import { useSearch } from '../../Common/Hooks/useSearch'
import { IPlanosAntiguos, IPlanosAntiguosColumns } from '../../Data/Models/Binnacle/Binnacle'
import { useFullIntl } from '../../Common/Hooks/useFullIntl'
import { $u } from '../../Common/Utils/Reimports'
import { LoadingSpinner } from '../../Components/Common/LoadingSpinner'

interface IPlanosAntiguosProps {
  idEquipo: string | undefined
}


const PlanosAntiguos = ({
  idEquipo
}: IPlanosAntiguosProps) => {

  const [search, doSearch] = useSearch();
  const { intl } = useFullIntl();

  //states
  const [filtersParams, setFiltersParams] = useState<{
    filterByEquipo: string | undefined
  }>({
    filterByEquipo: undefined
  })

  //Effects 
  useEffect(() => {
    setFiltersParams(state => $u(state, { filterByEquipo: { $set: idEquipo } }))
  }, [idEquipo])



  return (<>
    <Col sm={12} className="d-flex justify-content-end align-items-end px-0">
      <div className="col-lg-3 col-md-5 col-sm-6" style={{ verticalAlign: 'bottom' }}>
        <SearchBar onChange={doSearch} />
      </div>
    </Col>
    <Col sm={12} className=' px-0'>
      { filtersParams.filterByEquipo === undefined ? 
        <LoadingSpinner/> : 
        <ApiTable<IPlanosAntiguos>
        columns={IPlanosAntiguosColumns(intl, { onClickExcel: "downloadExcel" })}
        source={"index_pdf"}
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