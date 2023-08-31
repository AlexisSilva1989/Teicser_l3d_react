import React, { useCallback, useState } from 'react'
import { ListaBase } from '../../Common/ListaBase';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { useReload } from '../../../Common/Hooks/useReload';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { useToasts } from 'react-toast-notifications';
import { AxiosError } from 'axios';
import { ComponentesPlanoColumns, IComponentesPlano, IDataFormComponentesPlano } from '../../../Data/Models/ComponentesPlano/componentes_plano';
import ComponentesPlanoFormModal from '../../../Components/Modals/ComponentesPlanoFormModal';

const ListaPlanosComponentes = () => {
  const { capitalize: caps } = useFullIntl();
  const [reload, doReload] = useReload()
  const modalPlanosComponentes = useShortModal();
  const { addToast } = useToasts();

  const [filter, setFilter] = useState<{ status: string; tipo: string }>({
    status: '-1',
    tipo: '-1'
  });
  const [modalActionType, setModalActionType] = useState<"agregar" | "editar">("agregar")
  const [planosComponentesSelected, setPlanosComponentesSelected] = useState<IDataFormComponentesPlano | undefined>()
  const [isSaving, setIsSaving] = useState<boolean>(false);


  const modals = [
    {
      label: "Agregar",
      action: () => {
        setPlanosComponentesSelected(undefined)
        setModalActionType("agregar")
        modalPlanosComponentes.show();
      },
      className: "btn-primary"
    }
  ]

  const customFilter = useCallback((componentesPlano: IComponentesPlano): boolean => {
    const isFilterByStatus: boolean = filter.status == '-1' || componentesPlano.status == filter.status;
    return isFilterByStatus;
  }, [filter]);

  /*HANDLES */
  const onSubmitAdd = async (data: IDataFormComponentesPlano) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("nombre", data.nombre);

    setIsSaving(true);
    await ax.post('componentes_planos', formData, headers)
      .then((response) => {
        modalPlanosComponentes.hide();
        doReload();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.post', { element: "componentes del plano" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      })
      .finally(() => { setIsSaving(false) });
  };

  const onSubmitEdit = async (data: any) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("id_componente", data.id);
    formData.append("nombre", data.nombre);
    formData.append("status", data.status);

    setIsSaving(true);
    await ax.patch('componentes_planos', formData, headers)
      .then((response) => {
        modalPlanosComponentes.hide();
        doReload();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.post', { element: "componentes del plano" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      })
      .finally(() => { setIsSaving(false) });
  };

  return (<>
    <ListaBase<IComponentesPlano>
      title='titles:plans_components'
      source={$j('componentes_planos')}
      permission='masters'
      columns={ComponentesPlanoColumns}
      customFilter={customFilter}
      isRemoveAddButon
      modals={modals}
      reload={reload}
      onSelectWithModal={(data: any) => {
        setPlanosComponentesSelected(data)
        setModalActionType("editar")
        modalPlanosComponentes.show();
      }}
    >
      <ApiSelect<{ label: string, value: string }>
        name='componentes_plano_tipo'
        label='Activo'
        source={[
          {
            label: caps('labels:common.all'),
            value: '-1'
          },
          {
            label: caps('labels:common.yes'),
            value: '1'
          },
          {
            label: caps('labels:common.no'),
            value: '0'
          }
        ]}
        value={filter.status}
        selector={(option) => {
          return { label: option.label, value: option.value };
        }}
        onChange={(data) => {
          setFilter((s) => $u(s, { status: { $set: data } }));
        }}
      />
    </ListaBase>
    <ComponentesPlanoFormModal show={modalPlanosComponentes.visible} hide={modalPlanosComponentes.hide} size="sm" modalType={modalActionType} onSubmit={modalActionType === "agregar" ? onSubmitAdd : onSubmitEdit} isLoading={isSaving} title={`${modalActionType === "agregar" ? "Agregar" : "Modificar"} Componentes de Planos`} initialState={planosComponentesSelected} />
  </>);
}

export default ListaPlanosComponentes