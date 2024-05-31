import { IDataTableColumn } from "react-data-table-component";
import React, { useEffect, useState } from "react";
import { $m, update } from "../../../Common/Utils/Reimports";
import { ax } from "../../../Common/Utils/AxiosCustom";

export interface ICampania {
  numero_camp: number | undefined;
  fecha_inicio: Date | string | undefined;
  fecha_fin: Date | string | undefined;
  ia?: boolean;
  pol?: boolean;
  equipo_id?: number;
  componente_id?: number;
}

export const CampaniasColumns: (
  preSelectPol: number[],
  preSelectIa: number[],
  setIsAddFromIaPol: (isSaving: boolean) => void
) => IDataTableColumn<ICampania>[] = (
  preSelectPol,
  preSelectIa,
  setIsAddFromIaPol
) => {
  const [selectedCampaingsFromPol, setSelectedCampaingsFromPol] = useState<
    number[]
  >([]);
  const [selectedCampaingsFromIa, setSelectedCampaingsFromIa] = useState<
    number[]
  >([]);

  //HANDLES
  const handleRowSelectPol = async (
    numberCampaign: number,
    equipo: number,
    componente: number
  ) => {
    const isSelected: boolean =
      !selectedCampaingsFromPol.includes(numberCampaign);
    await saveSelectedCamp(
      numberCampaign,
      isSelected,
      "pol",
      equipo,
      componente
    );
  };

  const handleRowSelectIa = async (
    numberCampaign: number,
    equipo: number,
    componente: number
  ) => {
    const isSelected: boolean =
      !selectedCampaingsFromIa.includes(numberCampaign);
    await saveSelectedCamp(
      numberCampaign,
      isSelected,
      "ia",
      equipo,
      componente
    );
  };

  const saveSelectedCamp = async (
    numberCampaign: number,
    isSelected: boolean,
    type: "pol" | "ia",
    equipoId: number,
    componenteId: number
  ) => {
    setIsAddFromIaPol(true);
    await ax
      .post("service_render/campains/selected", {
        equipoId,
        componenteId,
        numberCampaign,
        isSelected,
        type,
      })
      .then(() => {
        type === "pol"
          ? updateCampaingsPol(numberCampaign, isSelected)
          : updateCampaingsIa(numberCampaign, isSelected);
      })
      .finally(() => {
        setIsAddFromIaPol(false);
      });
  };

  const updateCampaingsPol = (numberCampaign: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCampaingsFromPol([
        ...selectedCampaingsFromPol,
        numberCampaign,
      ]);
    } else {
      setSelectedCampaingsFromPol(
        selectedCampaingsFromPol.filter(
          (campaignSelected) => campaignSelected !== numberCampaign
        )
      );
    }
  };

  const updateCampaingsIa = (numberCampaign: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCampaingsFromIa([...selectedCampaingsFromIa, numberCampaign]);
    } else {
      setSelectedCampaingsFromIa(
        selectedCampaingsFromIa.filter(
          (campaignSelected) => campaignSelected !== numberCampaign
        )
      );
    }
  };

  useEffect(() => {
    setSelectedCampaingsFromPol(preSelectPol);
  }, [preSelectPol]);

  useEffect(() => {
    setSelectedCampaingsFromIa(preSelectIa);
  }, [preSelectIa]);

  return [
    {
      selector: "numero_camp",
      name: "Campaña",
    },
    {
      selector: "fecha_inicio",
      name: "Fecha inicio",
      format: (camp) => $m.utc(camp.fecha_inicio).format("YYYY-MM-DD"),
    },
    {
      selector: "fecha_fin",
      name: "Fecha fin",
      format: (camp) =>
        camp.fecha_fin ? $m.utc(camp.fecha_fin).format("YYYY-MM-DD") : null,
    },
    {
      name: "POL",
      cell: (campaign) => (
        <>
          <input
            type="checkbox"
            id={"selected_pol"}
            checked={selectedCampaingsFromPol.includes(
              campaign.numero_camp as number
            )}
            onChange={() => {
              handleRowSelectPol(
                campaign.numero_camp as number,
                campaign.equipo_id as number,
                campaign.componente_id as number
              );
            }}
          />
        </>
      ),
    },
    {
      name: "IA",
      cell: (campaign) => (
        <>
          <input
            type="checkbox"
            id={"selected_ia"}
            checked={selectedCampaingsFromIa.includes(
              campaign.numero_camp as number
            )}
            onChange={() => {
              handleRowSelectIa(
                campaign.numero_camp as number,
                campaign.equipo_id as number,
                campaign.componente_id as number
              );
            }}
          />
        </>
      ),
    },
  ];
};
