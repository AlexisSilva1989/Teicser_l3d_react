# Metalsigma Web Client

## 1. Sobre Metalsigma

Este repositorio contiene el código fuente de la aplicación web **Metalsigma**, que se complementa con la API anexa para otorgar funciones de alto nivel para la administración y seguimiento de procesos de la industria metalmecánica.

Metalsigma adquiere su nombre de **metalmécanica** y **SixSigma**.

## 2. Configuración

Para ejecutar el cliente debe ejecutarse una serie de pasos, para esto se espera que el usuario tenga conocimiento técnico:

1. (Opcional) Configurar VSCode, se recomienda utilizar los archivos **settings.json.example** y **launch.json.example** como base
2. Configurar variables de aplicación, esto corresponde a los siguientes archivos de ejemplo que deben ser duplicados y modificacados de forma que correspondan al entorno especificado, todos se encuentran en la carpeta **src/Config**:
	- **Api.ts.example:** URL de la API de Metalsigma para el acceso a datos
	- **Menus.ts.example:** Configuración de distribución, permisos y badges de menús
	- **Routes.ts.example:** Configuración de rutas disponibles para el usuario y componentes correspondientes
3. Instalar dependencias de la aplicación con `npm install`
4. Ejecutar aplicación con `npm start`
5. (Opcional) Empaquetar aplicación con `npm run build`