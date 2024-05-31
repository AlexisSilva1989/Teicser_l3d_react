import { BaseContentView } from "../Common/BaseContentView";
import React, { useState, useEffect, useRef } from "react";
import { DetalleRol, IPermissionDetalleRol } from "./DetalleRol";
import { $u, $j } from "../../Common/Utils/Reimports";
import { BounceLoader } from "react-spinners";
import { Buttons } from "../../Components/Common/Buttons";
import { Modal } from "../../Components/Common/Modal";
import { ValidatedForm, TEXTBOX } from "../../Components/Forms/ValidatedForm";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import { usePushError } from "../../Common/Hooks/usePushError";
import { ax } from "../../Common/Utils/AxiosCustom";
import { Rol } from "../../Data/Models/Configuracion/Rol";
import { Entidad } from "../../Data/Models/Configuracion/Entidad";
import { Col, Row, Container, Table } from "react-bootstrap";
import { useLocalization } from "../../Common/Hooks/useLocalization";
import { upperCase } from "voca";

interface State {
  data: {
    roles?: Rol[];
    permisos: IPermissionDetalleRol[];
  };
  reload: boolean;
  resetAgregar: boolean;
  entidadesPermiso: Entidad[];

  dataOfChangeOfPermission: roleChange;
}

const initial: State = {
  data: {
    permisos: [],
  },
  reload: true,
  resetAgregar: false,
  entidadesPermiso: [],

  dataOfChangeOfPermission: {
    roleName: undefined,
    roleId: undefined,
    entityName: undefined,
    permission: undefined,
    entityId: undefined,
  },
};

export interface roleChange {
  roleName: string | undefined;
  roleId: number | undefined;
  entityName: string | undefined;
  permission: number | undefined;
  entityId: number | undefined;
}

export const AdministrarRoles = () => {
  const { pushError } = usePushError();
  const { capitalize: caps } = useFullIntl();
  const { label, title, input, validation } = useLocalization();

  const [entidadesPermiso, setEntidadesPermiso] = useState(
    initial.entidadesPermiso
  );
  const [data, setData] = useState(initial.data);
  const [reload, setReload] = useState(initial.reload);
  const [resetAgregar, setResetAgregar] = useState(initial.resetAgregar);

  const [dataOfChangeOfPermission, setDataOfChangeOfPermission] = useState(
    initial.dataOfChangeOfPermission
  );

  const modalAgregar = useRef<HTMLDivElement>(null);
  const modalChangePermisson = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetch() {
      await ax
        .get<Rol[]>($j("roles"))
        .then((e) => {
          setData((s) => $u(s, { roles: { $set: e.data } }));
        })
        .catch(() => {
          pushError("errors:base.load", {
            element: caps("errors:elements.roles"),
            gender: "male",
          });
        });
      await ax
        .get($j("entidades_permiso"))
        .then((e) => {
          setEntidadesPermiso(e.data);
        })
        .catch(() => {
          pushError("errors:base.load", {
            element: caps("errors:elements.roles"),
            gender: "male",
          });
        });
      setReload(() => false);
    }

    if (!reload) {
      return;
    }
    fetch();
  }, [pushError, reload, caps]);

  function onChangePermission(permission: number) {
    setDataOfChangeOfPermission({ ...dataOfChangeOfPermission, permission });
  }

  async function handleSave() {
    $(modalChangePermisson.current!).modal("hide");
    setReload(() => true);
  }

  function onClickAgregarRol() {
    $(modalAgregar.current!).modal("show");
  }

  function onResetAgregar() {
    setResetAgregar(() => false);
  }

  async function onSubmitAgregar(e: any) {
    ///setReload(() => true);
    $(modalAgregar.current!).modal("hide");
    await ax
      .post($j("roles"), { nombre: e.nombre })
      .then(() => {
        setResetAgregar(() => true);
        setReload(() => true);
      })
      .catch(() => {
        pushError("errors:base.post", {
          element: caps("errors:elements.role"),
        });
      });
  }

  const handleClickModulePermissions = (roleChange: roleChange) => {
    $(modalChangePermisson.current!).modal("show");
    setDataOfChangeOfPermission(roleChange);
  };

  function onDeleteRole() {
    setReload(() => true);
    $(modalChangePermisson.current!).modal("hide");
  }

  return (
    <BaseContentView title="titles:roles_management">
      <Container>
        <Row>
          <Col className="d-flex justify-content-start">
            <Buttons.Add onClick={onClickAgregarRol} />
          </Col>
        </Row>
        <br></br>
        <Row>
          {data.roles && !reload ? (
            <Table className="prueba" striped bordered hover>
              <thead>
                <tr>
                  <td id="modulo">MÓDULOS</td>
                  {data.roles.map((rol, i) => {
                    return (
                      <td id="modulos" key={i}>
                        {rol.nombre}
                      </td>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {entidadesPermiso &&
                  entidadesPermiso.map((entity, i) => {
                    return (
                      <tr key={i}>
                        {/* <td> {entity.nombre.replace("_" , " ")} </td> */}

                        <td> {title(entity.nombre)} </td>

                        {data.roles?.map((role, i) => {
                          const permission = role.permisos.filter(
                            (permission) => permission.id_entidad === entity.id
                          )[0].nivel_permiso;
                          return (
                            <td
                              key={i}
                              style={{ textAlign: "center" }}
                              onClick={() => {
                                handleClickModulePermissions({
                                  roleName: role.nombre,
                                  roleId: role.codigo,
                                  entityName: entity.nombre,
                                  permission: permission,
                                  entityId: entity.id,
                                });
                              }}
                            >
                              {permission === 0 ? (
                                <i className="fas fa-eye-slash" />
                              ) : (
                                ""
                              )}
                              {permission === 1 ? (
                                <i className="fas fa-eye" />
                              ) : (
                                ""
                              )}
                              {permission === 2 ? (
                                <i className="fas fa-plus-circle" />
                              ) : (
                                ""
                              )}
                              {permission === 3 ? (
                                <i className="fas fa-edit" />
                              ) : (
                                ""
                              )}
                              {permission === 4 ? (
                                <i className="fas fa-trash-alt" />
                              ) : (
                                ""
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          ) : (
            <BounceLoader
              color="var(--primary)"
              css={{ margin: "2.5rem auto" } as any}
              size={64}
            />
          )}
        </Row>
      </Container>

      <div>
        <Modal title="titles:changePermisson" ref={modalChangePermisson}>
          <div className="modal-body">
            {dataOfChangeOfPermission.roleName && (
              <DetalleRol
                role={dataOfChangeOfPermission.roleName ?? ""}
                color="var(--secondary)"
                role_id={dataOfChangeOfPermission.roleId ?? 0}
                permissionData={dataOfChangeOfPermission}
                modules={[
                  {
                    name: dataOfChangeOfPermission.entityName ?? "",
                    permission: dataOfChangeOfPermission.permission ?? 0,
                    id: dataOfChangeOfPermission.entityId ?? 0,
                  },
                ]}
                onChangePermission={onChangePermission}
                onDelete={onDeleteRole}
                handleSave={handleSave}
              />
            )}
          </div>
        </Modal>
      </div>

      <div>
        <Modal
          title="titles:add_role"
          ref={modalAgregar}
          onClose={() => setResetAgregar(() => true)}
        >
          <div className="modal-body">
            <ValidatedForm
              validations={{
                nombre: {
                  presence: {
                    allowEmpty: false,
                    message: caps("validations:required"),
                  },
                },
              }}
              fields={[
                {
                  type: TEXTBOX,
                  name: "nombre",
                  label: "labels:inputs.name",
                  reset: true,
                  value: "",
                  span: 12,
                },
              ]}
              reset={resetAgregar}
              onReset={onResetAgregar}
              onSubmit={onSubmitAgregar}
            />
          </div>
        </Modal>
      </div>
    </BaseContentView>
  );
};
