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
  timeStamp: string[]
  crea_date: string
}