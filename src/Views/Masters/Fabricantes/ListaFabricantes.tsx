import React, { useCallback, useState } from 'react'
import { ListaBase } from '../../Common/ListaBase';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { Fabricante, FabricanteColumns, IDataFormFabricante } from '../../../Data/Models/Fabricante/Fabricante';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { useReload } from '../../../Common/Hooks/useReload';
import FabricanteFormModal from '../../../Components/Modals/FabricanteFormModal';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { useToasts } from 'react-toast-notifications';
import { AxiosError } from 'axios';

const ListaFabricantes = () => {
  const { capitalize: caps } = useFullIntl();
  const [reload, doReload] = useReload()
  const modalManufacturers = useShortModal();
  const { addToast } = useToasts();

  const [filter, setFilter] = useState<{ status: string; tipo: string }>({
    status: '-1',
    tipo: '-1'
  });
  const [modalActionType, setModalActionType] = useState<"agregar" | "editar">("agregar")
  const [manufacturerSelected, setManufacturerSelected] = useState<IDataFormFabricante | undefined>()
  const [isSaving, setIsSaving] = useState<boolean>(false);


  const modals = [
    {
      label: "Agregar",
      action: () => {
        setManufacturerSelected(undefined)
        setModalActionType("agregar")
        modalManufacturers.show();
      },
      className: "btn-primary"
    }
  ]

  const customFilter = useCallback((fabricante: Fabricante): boolean => {
    const isFilterByStatus: boolean = filter.status == '-1' || fabricante.status == filter.status;
    return isFilterByStatus;
  }, [filter]);

  /*HANDLES */
  const onSubmitAdd = async (data: IDataFormFabricante) => {
    const formData = new FormData();
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    formData.append("nombre", data.name);
    // formData.append("components_selected", JSON.stringify(data.components_selected));

    setIsSaving(true);
    await ax.post('fabricantes', formData, headers)
      .then((response) => {
        modalManufacturers.hide();
        doReload();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.post', { element: "fabricante" }), {
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
    formData.append("id_fabricante", data.id);
    formData.append("nombre", data.name);
    formData.append("status", data.status);

    setIsSaving(true);
    await ax.patch('fabricantes', formData, headers)
      .then((response) => {
        modalManufacturers.hide();
        doReload();
        addToast(caps('success:base.save'), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast(caps('errors:base.post', { element: "fabricante" }), {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      })
      .finally(() => { setIsSaving(false) });
  };

  return (<>
    <ListaBase<Fabricante>
      title='titles:manufacturers'
      source={$j('fabricantes')}
      permission='masters'
      columns={FabricanteColumns}
      customFilter={customFilter}
      isRemoveAddButon
      modals={modals}
      reload={reload}
      onSelectWithModal={(data: any) => {
        console.log(data)
        setManufacturerSelected(data)
        setModalActionType("editar")
        modalManufacturers.show();
      }}
    >
      <ApiSelect<{ label: string, value: string }>
        name='equipo_tipo'
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
    <FabricanteFormModal show={modalManufacturers.visible} hide={modalManufacturers.hide} size="sm" modalType={modalActionType} onSubmit={modalActionType === "agregar" ? onSubmitAdd : onSubmitEdit} isLoading={isSaving} title={`${modalActionType === "agregar" ? "Agregar" : "Modificar"} Fabricante`} initialState={manufacturerSelected} />
  </>);
}

export default ListaFabricantes