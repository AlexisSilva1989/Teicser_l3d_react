import { BaseContentView } from "./BaseContentView";
import React, { useState, PropsWithChildren, useEffect } from "react";
import { Buttons } from "../../Components/Common/Buttons";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { SearchBar } from "../../Components/Forms/SearchBar";
import { $u } from "../../Common/Utils/Reimports";
import { useCommonRoutes } from "../../Common/Hooks/useCommonRoutes";
import { LocalizedColumnsCallback } from "../../Common/Utils/LocalizedColumnsCallback";
import { usePermissions, UserPermission } from "../../Common/Hooks/usePermissions";
import { useFullLocation } from "../../Common/Hooks/useFullLocation";
import { usePath } from "../../Common/Hooks/usePath";
import { BounceLoader } from "react-spinners";
import { ApiTable } from "../../Components/Api/ApiTable";

export interface ListaBaseLink {
  to: string;
  label: string;
  state?: any;
  icon?: string;
  className?: string;
}

interface Props<T> {
  title?: string;
  source: string | T[];
  permission: UserPermission;
  columns: LocalizedColumnsCallback<T>;
  onSelect?: "details" | "modify";
  links?: ListaBaseLink[];
  customFilter?: (e: T) => boolean;
  reload?: boolean;
  loading?: boolean;
  innerPath?: string;
  //funcion
  handle?: () => void;

  //PAGINATION
  noRowsPerPage?: boolean
  paginationServe?: boolean

  //FILTERING
  paramsFilter?: object

  labelBotton?: string
  queryParams?: any
  isRemoveAddButon?: boolean 
}

interface State {
  search: string;
}

const initial: State = {
  search: "",
};

export const ListaBase = <T extends unknown>(props: PropsWithChildren<Props<T>>) => {
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const { capitalize: caps, intl, localize } = useFullIntl();
  const { pushTo, mayBack } = useFullLocation();
  const { gotoModify, gotoDetails } = useCommonRoutes();

  const [search, setSearch] = useState(initial.search);

  const isPathCliente = usePath('clientes');

  const listChildren = ()=>{
    const childrens = props.children && (Array.isArray( props.children) 
      ? props.children as React.ReactNode[] 
      : [props.children as React.ReactNode]);
    const childrensMaps = childrens && childrens.map((children, index) => {
      let childrenNode = children as React.ReactNode;
      return (
        <div className={"col-lg-2 col-md-3 col-sm-6 text-left mb-2"} key={'filter-'+index}>
          {children}
        </div>
      );
    })
    return childrensMaps;
  }

  return (
    <BaseContentView title={props.title}>
     
      {/*BOTON DE VOLVER*/}
      { mayBack &&  <div className='col-12 mb-4'><Buttons.Back /> </div>}
     
      {/* BOTONERA */}
      <div className='col-12 mb-2'>
        {/*BOTON DE AGREGAR*/}
        {((!props.isRemoveAddButon) && canCreate(props.permission)) &&
          <Buttons.Add path={props.innerPath
            ? localize('routes:meta.inner_add', { element: localize(props.innerPath) })
            : localize('routes:meta.add')}
            className='mr-3 mb-2'  label={props.labelBotton && props.labelBotton}
          />
        }
        
        {/*LINKS RECIBIDOS (BOTONES)*/}
        {props.links && props.links.map((x, i) => {
          return (
            <button className={'mr-3 mb-2 btn ' + (x.className ?? 'btn-outline-primary')} onClick={() => pushTo(x.to, x.state)} key={i}>
              <i className={'mr-3 ' + (x.icon ?? 'fas fa-arrow-right')} />
              {caps(x.label)}
            </button>
          );
        })}
        
        {/*boton para descargar listado cliente solo los que tengan permiso de eliminar*/}
        {(canDelete(props.permission) && isPathCliente) &&
          (< Buttons.Common
            className='mr-3 mb-2 btn-outline-info'
            label='Descargar listado'
            icon='fas fa-file-excel'
            type='button'
            //hacemos un llamadao a un hooks para Descargar
            onClick={props.handle}
          />)
        }
      </div>
      
      {/* INPUT DE BUSQUEDA */}
      <div className='col-12 text-right pr-0 pl-0' >
        {listChildren()} 
        <div className="col-lg-3 col-md-5 col-sm-6" style={{verticalAlign:'bottom'}}>
          <SearchBar onChange={(e) => setSearch((s) => $u(s, { $set: e }))} />
        </div>
      </div>
      
      {/* TABLA DE DATOS */}
      <div className="col-12">
        {props.loading ? (
          <BounceLoader
            css={{ margin: "2.25rem auto" } as any}
            color="var(--primary)"
          />
        ) : (
          <ApiTable<T>
            columns={props.columns(intl)}
            source={props.source}
            queryParams={props.queryParams}
            reload={props.reload}
            search={search}
            customFilter={props.customFilter}
            onSelect={(e) =>
              props.onSelect == null || props.onSelect === "modify"
                ? canUpdate(props.permission)
                  ? gotoModify({ data: e }, props.innerPath)
                  : undefined
                : gotoDetails({ data: e })
            }
            paginationServe={props.paginationServe}
            filterServeParams={props.paramsFilter}
          />
        )}
      </div>
    </BaseContentView>
  );
};
