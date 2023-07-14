export interface ProjectionPolinomio {
  nombre: string
  data: {
    lifter?: {
      x: any
      y: any
    }[],
    placa?: {
      x: any
      y: any
    }[],
    placa_b?: {
      x: any
      y: any
    }[],
  }
  mediciones: {
    lifter?: {
      x: any
      y: any
    }[],
    placa?: {
      x: any
      y: any
    }[],
    placa_b?: {
      x: any
      y: any
    }[],
  }
  puntosCriticos: {
    lifter?: number | undefined,
    placa?: number | undefined,
    placa_b?: number | undefined,
  }
  timeStamp: string[]
  crea_date: string
}