export interface TypesIndrustries {
  banqueteria: string;
  reparacionMaquinaria: string;
}

export const industries = [
  "N/A",
  "reparacionMaquinaria",
  "banqueteria",
  "generica",
];

export type typeIndustries =
  | "banqueteria"
  | "reparacionMaquinaria"
  | "generica";

export const titlesByIndustries = {
  banqueteria: {
    maestra: {
      tipoCotizacion: {
        tabs: [
          "quotation_types",
          "seccion",
          "sub_service",
          "type_service",
          "catalogos",
        ],
        add: ["add_type_service", "add_seccion", "add_sub_service"],
        modify: ["modify_type_service", "modify_seccion", "modify_sub_service"],
        columns: {
          sistema: [
            "columns:id",
            "columns:internal",
            "columns:seccion",
            "columns:status_data",
          ],
          componentes: [
            "columns:id",
            "columns:internal",
            "columns:sub_service",
            "columns:seccion",
            "columns:status_data",
          ],
        },
      },
    },
  },
  reparacionMaquinaria: {
    maestra: {
      tipoCotizacion: {
        tabs: [
          "quotation_types",
          "systems",
          "components",
          "own_services",
          "catalogos",
        ],
        add: ["add_own_services", "add_system", "add_component"],
        modify: ["modify_own_services", "modify_system", "modify_component"],
        columns: {
          sistema: [
            "columns:id",
            "columns:internal",
            "columns:system",
            "columns:status_data",
          ],
          componentes: [
            "columns:id",
            "columns:internal",
            "columns:component",
            "columns:system",
            "columns:status_data",
          ],
        },
      },
    },
  },
  generica: {
    maestra: {
      tipoCotizacion: {
        tabs: [
          "quotation_types",
          "seccion",
          "sub_service",
          "type_service",
          "catalogos",
        ],
        add: ["add_type_service", "add_seccion", "add_sub_service"],
        modify: ["modify_type_service", "modify_seccion", "modify_sub_service"],
        columns: {
          sistema: [
            "columns:id",
            "columns:internal",
            "columns:seccion",
            "columns:status_data",
          ],
          componentes: [
            "columns:id",
            "columns:internal",
            "columns:sub_service",
            "columns:seccion",
            "columns:status_data",
          ],
        },
      },
    },
  },
};
