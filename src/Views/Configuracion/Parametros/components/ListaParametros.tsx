import React from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { useLocalizedColumns } from "../../../../Common/Hooks/useColumns";
import { ApiTable } from "../../../../Components/Api/ApiTable";
import { Parametro, ParametroColumns } from "../../../../Dtos/Parametro";
import { SearchBar } from "../../../../Components/Forms/SearchBar";
import { useSearch } from "../../../../Common/Hooks/useSearch";
import { useFullIntl } from "../../../../Common/Hooks/useFullIntl";
interface Props {
  reload: boolean;
  source: Parametro[];
  onSelect: (parametro: Parametro) => void;
}

export const ListaParametros = (props: Props) => {
  const { source, reload, onSelect } = props;
  const parametroColumns = useLocalizedColumns(ParametroColumns);
  const [search, doSearch] = useSearch();
  const { capitalize: caps } = useFullIntl();

  const tableParams = (orden: number) => {
    return (
      <Col sm={12}>
        <Col sm={3} className="offset-9 mb-3">
          <SearchBar onChange={doSearch} />
        </Col>
        <Col sm={12}>
          <ApiTable<Parametro>
            source={source.filter((parametro: Parametro) => {
              return parametro.orden == orden;
            })}
            reload={reload}
            search={search}
            columns={parametroColumns}
            onSelect={onSelect}
          />
        </Col>
      </Col>
    );
  };

  return (
    <Col sm={12}>
      <Tabs
        id="tabs-params"
        defaultActiveKey="companyIdentification"
        className="border rounded-top"
      >
        <Tab
          eventKey="companyIdentification"
          title={caps("labels:tabs.company_identification")}
          className="border border-top-0 rounded-bottom p-3"
        >
          {tableParams(1)}
        </Tab>
        <Tab
          eventKey="activitiesAndResources"
          title={caps("labels:tabs.activities_resources")}
          className="border border-top-0 rounded-bottom p-3"
        >
          {tableParams(2)}
        </Tab>
        <Tab
          eventKey="taxValues"
          title={caps("labels:tabs.tax_values")}
          className="border border-top-0 rounded-bottom p-3"
        >
          {tableParams(3)}
        </Tab>
        <Tab
          eventKey="config"
          title={caps("labels:tabs.config_qz")}
          className="border border-top-0 rounded-bottom p-3"
        >
          {tableParams(4)}
        </Tab>
        <Tab
          eventKey="costAndMargins"
          title={caps("labels:tabs.cost_margins")}
          className="border border-top-0 rounded-bottom p-3"
        >
          {tableParams(5)}
        </Tab>
      </Tabs>
    </Col>
  );
};
