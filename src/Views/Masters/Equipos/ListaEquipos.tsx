import React, { useState, useCallback, useEffect } from "react";
import { $j, $u } from "../../../Common/Utils/Reimports";
import { CustomSelect } from "../../../Components/Forms/CustomSelect";
import { ListaBase, ListaBaseModal } from "../../Common/ListaBase";
import {
  EquipoColumns,
  EquipoTipo,
  ItemOrderEquip,
  tiposEquipos,
  tiposEquiposWithAll,
} from "../../../Data/Models/Equipo/Equipo";
import { ApiSelect } from "../../../Components/Api/ApiSelect";
import { useFullIntl } from "../../../Common/Hooks/useFullIntl";
import EquipOrderModal from "../../../Components/Modals/EquipOrderModal";
import { useShortModal } from "../../../Common/Hooks/useModal";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { AxiosError } from "axios";
import { useToasts } from "react-toast-notifications";
import { useReload } from "../../../Common/Hooks/useReload";

export const ListaEquipos = () => {
  const { capitalize: caps } = useFullIntl();
  const { addToast } = useToasts();
  const orderModal = useShortModal();
  const [reload, doReload] = useReload();

  const [filter, setFilter] = useState<{ status: string; tipo: string }>({
    status: "-1",
    tipo: "-1",
  });
  const [equipList, setEquipList] = useState<EquipoTipo[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [isSavingOrder, setIsSavingOrder] = useState<boolean>(false);
  const customFilter = useCallback(
    (equipo: EquipoTipo): boolean => {
      const isFilterByStatus: boolean =
        filter.status == "-1" || equipo.status.toString() == filter.status;
      const isFilterByTipo: boolean =
        filter.tipo == "-1" || equipo.equipo_tipo.id == filter.tipo;
      return isFilterByStatus && isFilterByTipo;
    },
    [filter]
  );

  const modalButtons: ListaBaseModal[] = [
    {
      action: () => orderModal.show(),
      label: "Orden de Equipos",
    },
  ];

  const getList = useCallback(async () => {
    setIsLoadingTable(true);
    await ax
      .get($j("service_render/equipos"), { params: { showStatus: true } })
      .then((response) => {
        setEquipList(response.data);
        doReload();
      })
      .catch((e: AxiosError) => {
        if (e.response) {
        }
      })
      .finally(() => {
        setIsLoadingTable(false);
      });
  }, []);

  const saveOrderedList = useCallback(
    async (order: { id: string | number; order: number }[]) => {
      setIsSavingOrder(true);
      await ax
        .post($j("service_render/equipos"), { order })
        .then((response) => {
          getList();
          doReload();
          orderModal.hide();
        })
        .catch((e: AxiosError) => {
          if (e.response) {
          }
        })
        .finally(() => {
          setIsSavingOrder(false);
        });
    },
    []
  );

  const submitOrderEquip = useCallback(async (data: ItemOrderEquip[]) => {
    const mappedData = data.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    saveOrderedList(mappedData);
  }, []);

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <ListaBase<EquipoTipo>
        title="titles:equipments"
        source={equipList}
        permission="masters"
        columns={EquipoColumns}
        customFilter={customFilter}
        modals={modalButtons}
        reload={reload}
        loading={isLoadingTable}
      >
        <ApiSelect<{ id: string; nombre_corto: string }>
          name="equipo_status"
          label="Tipo"
          source={"service_render/equipos/tipos"}
          value={filter.tipo}
          firtsOptions={{ value: "-1", label: caps("labels:common.all") }}
          selector={(option) => {
            return { label: option.nombre_corto, value: option.id };
          }}
          onChange={(data) => {
            setFilter((s) => $u(s, { tipo: { $set: data } }));
          }}
        />

        <ApiSelect<{ label: string; value: string }>
          name="equipo_tipo"
          label="Activo"
          source={[
            {
              label: caps("labels:common.all"),
              value: "-1",
            },
            {
              label: caps("labels:common.yes"),
              value: "1",
            },
            {
              label: caps("labels:common.no"),
              value: "0",
            },
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
      <EquipOrderModal<EquipoTipo[]>
        show={orderModal.visible}
        title="Orden de Equipos"
        hide={orderModal.hide}
        initialState={equipList.map((item) => ({
          id: item.id,
          name: item.nombre,
        }))}
        onSubmit={submitOrderEquip}
        isLoading={isSavingOrder}
      />
    </>
  );
};
