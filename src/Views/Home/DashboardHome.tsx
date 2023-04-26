import React from 'react';
import { BaseContentView } from '../Common/BaseContentView';
import { Button } from 'react-bootstrap';
import { useFullLocation } from '../../Common/Hooks/useFullLocation';
import { $j } from '../../Common/Utils/Reimports';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';

export const DashboardHome = () => {
	const { history } = useFullLocation();
	const { localize } = useFullIntl();

  return <BaseContentView>
    <Button variant={"primary"} 
      onClick={()=>history.push($j(localize('routes:base.projections')),{data:{id:1}})}>
      <i className={"fas fa-plus mr-1"} /> Ver equipo
    </Button>
  </BaseContentView>;
}