export interface IParametrosReferencias {
  equipo_id: string | number
  componente_id: string | number

  active_ia: boolean | string
  dias_ia: number | null
  is_full_sampling_ia: boolean | string
  num_samples_train_ia: number | null
  num_samples_val_ia: number | null
  ignore_cols_ia: string | null

  active_polinomio: boolean | string
  dias_pol: number
  tonelaje_diario_componente: number
  grado_pol_lifter:number
  grado_pol_placa:number
  grado_pol_placa_b:number

  active_multivariado: boolean | string
  dias_multivariado: number

  critico_lifter: number | null
  critico_placa_a: number | null
  critico_placa_b: number | null
}