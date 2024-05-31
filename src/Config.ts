export const baseURL =
  process.env.REACT_APP_URL_BASE || "https://devapi.metalsigma.cl/";
export const apiUrl =
  process.env.REACT_APP_URL_API || "https://devapi.metalsigma.cl/api";

//credention pusher
export const PUSHER_APP_KEY = "66556cd67fb70e4f4030";
export const PUSHER_APP_CLUSTER = "us2";

//solo para configuracion nativa con laravelwebsockets
export const PUSHER_APP_PORT = 6001;

//LINK DE REDIRECCION PARA CLIENTES NO REGISTRADOS
export const HOME_QUALITZER =
  process.env.REACT_APP_HOME_QUALITZER || "https://home.qualitzer.io";
