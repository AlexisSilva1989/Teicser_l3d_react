import React, { useRef } from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { ConfirmationModal } from '../../Components/Common/ConfirmationModal';
import { $j } from '../../Common/Utils/Reimports';
import { pushError } from '../../Store/Dashboard/DashboardActionCreators';
import { usePermissions } from '../../Common/Hooks/usePermissions';
import { ax } from '../../Common/Utils/AxiosCustom';
import { Permissions } from '../../Common/Utils/Permissions';
import { Buttons } from '../../Components/Common/Buttons';
import { roleChange } from './AdministrarRoles';

interface IModuloDetalleRol {
	id: number
	name: string
	permission: number
}

export interface IPermissionDetalleRol {
	role: number
	entity: number
	permission: number
}

interface Props {
	role_id: number
	role: string
	color: string
	permissionData: roleChange

	onDelete?: () => void
	handleSave?: () => void
	modules?: IModuloDetalleRol[]
	onChangePermission?: (permission: number) => void
}

export const DetalleRol = (props: Props) => {
	const { capitalize: caps } = useFullIntl();
	const { canDelete } = usePermissions();

	const modalBorrar = useRef<HTMLDivElement>(null);

	function onChangePermissionRadio(permission: number) {
		if (props.onChangePermission != null) {
			props.onChangePermission( permission );
		}
	}

	function onClickBorrar() {
		$(modalBorrar.current!).modal('show');
	}

	async function onConfirmBorrar() {
		$(modalBorrar.current!).modal('hide');
		await ax
			.delete($j('roles', props.role_id.toString()))
			.then(() => {
				if (props.onDelete != null) {
					props.onDelete();
				}
			})
			.catch(() => {
				pushError('errors:base.delete', {
					element: caps('errors:elements.role'),
					gender: 'male'
				});
			});
	}

	const handleClickChangeSavePermission = async () => {
		props.handleSave && props.handleSave();
		await ax
			.patch($j('roles'), {
				permisos: [{
					rol: props.permissionData.roleId,
					entidad: props.permissionData.entityId,
					permiso: props.permissionData.permission
				}]
			})
			.then(() => {})
			.catch(() => {
				pushError('errors:base.update', {
					element: caps('errors:elements.roles'),
					gender: 'male'
				});
			});
	}


	return (
		<div className='row mx-1 card'>
			<div className='col-12'>
				<div className='row'>
					<div className='font-weight-light text-uppercase text-white col-12 text-center py-2' style={{ backgroundColor: props.color }}>
						<div className='d-flex'>
							<div style={{ width: canDelete('configuracion') ? '95%' : '100%' }}>
								<span className='h4 mb-0'>{props.role}</span>
							</div>
							{canDelete('configuracion') && (
								<div>
									<i className='fas fa-trash-alt' style={{ cursor: 'pointer' }} onClick={onClickBorrar} />
								</div>
							)}
						</div>
					</div>
					<div
						className='col-12'
						style={{
							overflowY: 'hidden',
							overflowX: 'hidden'
						}}>
						<div className='row text-center border-bottom font-weight-bold'>
							<div className='py-3 col-4 border-right'>{caps('labels:misc.module')}</div>
							<div className='py-3 col border-right'>
								<i className='fas fa-eye-slash' />
							</div>
							<div className='py-3 col border-right'>
								<i className='fas fa-eye' />
							</div>
							<div className='py-3 col border-right'>
								<i className='fas fa-plus-circle' />
							</div>
							<div className='py-3 col border-right'>
								<i className='fas fa-edit' />
							</div>
							<div className='py-3 col'>
								<i className='fas fa-trash-alt' />
							</div>
						</div>
						{props.modules &&
							props.modules.map((x, i) => {
								return (
									<div key={i} className='row text-center'>
										<div className='py-2 col-4 border-right border-bottom static'>{x.name}</div>
										<div className='py-2 col border-right border-bottom'>
											<input type='radio' name={props.role + '-' + x.id} checked={x.permission === Permissions.None} onChange={() => onChangePermissionRadio(Permissions.None)} />
										</div>
										<div className='py-2 col border-right border-bottom'>
											<input type='radio' name={props.role + '-' + x.id} checked={x.permission === Permissions.Read} onChange={() => onChangePermissionRadio(Permissions.Read)} />
										</div>
										<div className='py-2 col border-right border-bottom'>
											<input type='radio' name={props.role + '-' + x.id} checked={x.permission === Permissions.Create} onChange={() => onChangePermissionRadio(Permissions.Create)} />
										</div>
										<div className='py-2 col border-right border-bottom'>
											<input type='radio' name={props.role + '-' + x.id} checked={x.permission === Permissions.Update} onChange={() => onChangePermissionRadio(Permissions.Update)} />
										</div>
										<div className='py-2 col border-bottom'>
											<input type='radio' name={props.role + '-' + x.id} checked={x.permission === Permissions.Delete} onChange={() => onChangePermissionRadio(Permissions.Delete)} />
										</div>
									</div>
								);
							})}
					</div>
				
				</div>
				<div>
					<div className='d-flex justify-content-end' style={{padding: "5px"}}><Buttons.Save onClick={handleClickChangeSavePermission} /></div>
				</div>
			</div>
			<div>
				<ConfirmationModal onCancel={() => $(modalBorrar.current!).modal('hide')} onConfirm={onConfirmBorrar} ref={modalBorrar}>
					{caps('messages:confirm_delete_role')}
				</ConfirmationModal>
			</div>
		</div>
	);
};
