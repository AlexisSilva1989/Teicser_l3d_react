import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useLocalization } from "../../../Common/Hooks/useLocalization";
import { useShortModal } from "../../../Common/Hooks/useModal";
import { useReload } from "../../../Common/Hooks/useReload";
import { ax } from "../../../Common/Utils/AxiosCustom";
import { $u, joinUrls } from "../../../Common/Utils/Reimports";
import { Parametro } from "../../../Dtos/Parametro";
import { ContainerView } from "../../Common/ContainerView";
// import { AgregarParametro } from './components/AgregarParametro';
// import { ConfirmarAgregarParametro } from './components/ConfirmarAgregarParametro';
import { ConfirmarModificarParametro } from "./components/ConfirmarModificarParametro";
import { ListaParametros } from "./components/ListaParametros";
import { ModificarParametro } from "./components/ModificarParametro";
import { BounceLoader } from "react-spinners";

const Parametros = () => {
  const [reload, doReload] = useReload();
  const [loadingg, setLoadingg] = useState(false);
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [seleccionado, setSeleccionado] = useState<Parametro>();
  const [cambios, setCambios] =
    useState<Record<"valor" | "descripcion", string>>();
  // const [creado, setCreado] = useState<Record<'nombre' | 'valor' | 'descripcion', string>>();
  // const { label } = useLocalization();

  // const modalAgregar = useShortModal();
  // const modalPersistir = useShortModal();
  const modalModificar = useShortModal();
  const modalPersistirCambios = useShortModal();

  useEffect(() => {
    async function fetch() {
      setLoadingg(() => true);
      await ax.get<Parametro[]>("v2/parametros").then((response) => {
        setLoadingg(() => false);
        setParametros(response.data);
        doReload();
      });
    }
    fetch();
  }, []);

  function abrirModal(parametro: Parametro) {
    setSeleccionado(parametro);
    modalModificar.show();
  }

  // function crearParametro(datos: Record<'nombre' | 'valor' | 'descripcion', string>) {
  // 	modalAgregar.hide();
  // 	setCreado(datos);
  // 	modalPersistir.show();
  // }

  // function persistirParametro() {
  // 	ax.post<Parametro>('v2/parametros', creado).then(response => {
  // 		setParametros(state => $u(state, { $push: [response.data] }));
  // 		doReload();
  // 	}).finally(() => {
  // 		modalPersistir.hide();
  // 	});
  // }

  function modificarParametro(datos: Record<"valor" | "descripcion", string>) {
    modalModificar.hide();
    setCambios(datos);
    modalPersistirCambios.show();
  }

  function persistirCambiosParametro() {
    ax.patch(joinUrls("v2", "parametros", seleccionado!.id.toString()), cambios)
      .then(() => {
        const index = parametros.findIndex(
          (parametro) => parametro === seleccionado
        );
        setParametros((state) =>
          $u(state, { [index]: { $set: { ...parametros[index], ...cambios } } })
        );
        doReload();
      })
      .finally(() => {
        modalPersistirCambios.hide();
      });
  }

  return (
    <ContainerView title="parameters">
      {/* <Col sm={12} className='text-right mb-3'>
			<Button className='d-flex justify-content-start' variant='primary' onClick={modalAgregar.show}>
				<i className='fas fa-plus mr-3' />
				{label('add')}
			</Button>
		</Col> */}
      <Col sm={12}>
        {loadingg ? (
          <BounceLoader
            css={{ margin: "2.25rem auto" } as any}
            color="var(--primary)"
          />
        ) : (
          <ListaParametros
            source={parametros}
            reload={reload}
            onSelect={abrirModal}
          />
        )}
      </Col>

      {/* <AgregarParametro onSubmit={crearParametro} visible={modalAgregar.visible} hide={modalAgregar.hide} /> */}
      {/* <ConfirmarAgregarParametro onSubmit={persistirParametro} visible={modalPersistir.visible} hide={modalPersistir.hide} /> */}
      <ModificarParametro
        parametro={seleccionado}
        onSubmit={modificarParametro}
        visible={modalModificar.visible}
        hide={modalModificar.hide}
      />
      <ConfirmarModificarParametro
        onSubmit={persistirCambiosParametro}
        visible={modalPersistirCambios.visible}
        hide={modalPersistirCambios.hide}
      />
    </ContainerView>
  );
};

export default Parametros;
