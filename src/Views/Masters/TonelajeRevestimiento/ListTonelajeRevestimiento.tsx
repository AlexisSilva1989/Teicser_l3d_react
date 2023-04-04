import { AxiosError, AxiosResponse } from 'axios';
import React from 'react'
import { Col } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { $d, $j, $m } from '../../../Common/Utils/Reimports';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { SearchBar } from '../../../Components/Forms/SearchBar';
import { ITonelajeRevestimientosTable, TonelajeRevestimientosColumns } from '../../../Data/Models/TonelajeRevestimientos/TonelajeRevestimientos';
import { BaseContentView } from '../../Common/BaseContentView';

function ListTonelajeRevestimiento() {
  const { intl } = useFullIntl();
  const { setLoading } = useDashboard();
	const { addToast } = useToasts();
  const [search, doSearch] = useSearch();

  const downloadExcel = async (equipment: string) => {
    setLoading(true);
    const nombreArchivo = `TDR_${equipment.toUpperCase()}_${$m().format("YYYYMMDDHHmmss")}.xlsx`

    await ax.get($j('service_render', 'tdr', 'excel'),{ responseType: "blob" , params: { equipment } })
      .then((e: AxiosResponse) => {
        $d(e.data, nombreArchivo, e.headers["content-type"]);
      })
      .catch(() => {
        addToast('Error en la descarga', {
          appearance: 'error',
          autoDismiss: true,
        });
      })
      .finally(()=>{
        setLoading(false);
      });
  }

  return (
    <>
      <BaseContentView title='titles:tdr'>
        <Col sm={12} className="d-flex justify-content-end align-items-end pr-0 pl-0">
          <div className="col-lg-3 col-md-5 col-sm-6" style={{ verticalAlign: 'bottom' }}>
            <SearchBar onChange={doSearch} />
          </div>
        </Col>
        <Col sm={12} className="mt-3">
          <ApiTable<ITonelajeRevestimientosTable>
            columns={TonelajeRevestimientosColumns(intl, { onClickExcel: downloadExcel })}
            source={$j('service_render', 'tdr')}
            search={search}
          />
        </Col>
      </BaseContentView>
    </>

  )
}

export default ListTonelajeRevestimiento