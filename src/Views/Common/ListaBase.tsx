import { BaseContentView } from "./BaseContentView";
import React, { useState, PropsWithChildren } from "react";
import { Buttons } from "../../Components/Common/Buttons";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { SearchBar } from "../../Components/Forms/SearchBar";
import { $u } from "../../Common/Utils/Reimports";
import { useCommonRoutes } from "../../Common/Hooks/useCommonRoutes";
import { LocalizedColumnsCallback } from "../../Common/Utils/LocalizedColumnsCallback";
import {
  usePermissions,
  UserPermission,
} from "../../Common/Hooks/usePermissions";
import { useFullLocation } from "../../Common/Hooks/useFullLocation";
import { usePath } from "../../Common/Hooks/usePath";
import { BounceLoader } from "react-spinners";
import { ApiTable } from "../../Components/Api/ApiTable";


interface ListaBaseLink {
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
}

interface State {
  search: string;
}

const initial: State = {
  search: "",
};

export const ListaBase = <T extends unknown>(props: PropsWithChildren<Props<T>>) => {
	const { canCreate, canUpdate , canDelete} = usePermissions();
	const { capitalize: caps, intl ,  localize } = useFullIntl();
	const { pushTo, mayBack } = useFullLocation();
	const { gotoModify, gotoDetails } = useCommonRoutes();

  const [search, setSearch] = useState(initial.search);


	const isPathCliente = usePath('clientes');
	
   
	return (
		<BaseContentView title={props.title}>
			{(props.links || mayBack) && (
				<div className='col-12 mb-4'>
					{mayBack && <Buttons.Back />}
					{props.links &&
						props.links.map((x, i) => {
							return (
								<button className={'mr-3 btn ' + (x.className ?? 'btn-outline-primary')} onClick={() => pushTo(x.to, x.state)} key={i}>
									<i className={'mr-3 ' + (x.icon ?? 'fas fa-arrow-right')} />
									{caps(x.label)}
								</button>
							);
						})}
				</div>
			)}
			<div className='col-3'>
				
				{
				 	canCreate(props.permission) && 
				 	<Buttons.Add path={props.innerPath ? localize('routes:meta.inner_add',{ element: localize(props.innerPath) }) : localize('routes:meta.add')} 
				 	className='mr-3 ' />
				}
				
				{/*boton para descargar listado cliente solo los que tengan permiso de eliminar*/}
				
				{(canDelete(props.permission) && isPathCliente ) ? 
						< Buttons.Common 
							className='mr-3 btn-outline-info' 
							label='Descargar listado'
							icon='fas fa-file-excel'
							type='button'
							//hacemos un llamadao a un hooks para Descargar
							onClick={props.handle}
						/>
					: 
						''
				}
				
			</div>

      {props.children}

      <div className={props.children ? "col-3 offset-3" : "col-3 offset-6"}>
        <SearchBar onChange={(e) => setSearch((s) => $u(s, { $set: e }))} />
      </div>
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
          />
        )}
      </div>
    </BaseContentView>
  );
};
