import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { ReactSortable } from 'react-sortablejs'
import { EquipoTipo, ItemOrderEquip } from '../../Data/Models/Equipo/Equipo';
import { LoadingSpinner } from '../Common/LoadingSpinner';

interface Props<T> {
  show: boolean;
  hide: () => void;
  size?: "sm" | "lg" | "xl";
  title?: string;
  textButton?: string;
  onSubmit?: (data: ItemOrderEquip[]) => void;
  initialState?: ItemOrderEquip[];
  isLoading?: boolean;
}


const EquipOrderModal = <T extends unknown>({ show, size = "sm", hide, title = '', textButton = "Enviar", onSubmit, initialState, isLoading = false }: Props<T>) => {
  const [listEquip, setListEquip] = useState<ItemOrderEquip[]>([]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc")

  const handleAlphabeticalSort = () => {

    setListEquip(state => state.sort((a, b) => {
      const order = orderDirection === "desc"
      if (order) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      } else {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }
    }
    ));

    setOrderDirection(state => state === "desc" ? "asc" : "desc")
  }


  useEffect(() => {
    initialState && setListEquip(initialState)
  }, [initialState])

  return (
    <Modal show={show} size={size} onHide={hide} centered >
      <Modal.Header className='bg-dark text-white font-weight-bold' >
        {title}
        <div onClick={() => hide()} style={{ cursor: "pointer" }}>
          <i className='fas fa-times text-white' />
        </div>
      </Modal.Header>
      <Modal.Body style={{ minHeight: '256px', maxHeight: '480px', overflowY: 'scroll' }} >
        {isLoading ? <LoadingSpinner /> : (
          <div className='d-flex flex-column items-center justify-start' style={{ gap: 8 }} >
            <Button variant='secondary' onClick={handleAlphabeticalSort} >
              {
                orderDirection !== "desc" ? (<i className='fas fa-sort-alpha-down' />) : (
                  <i className='fas fa-sort-alpha-up' />
                )
              }
            </Button>
            <ReactSortable group="groupName"
              animation={200}
              delay={2} className='d-flex flex-column' style={{ gap: 4 }} list={listEquip} setList={setListEquip} onEnd={() => setOrderDirection("desc")} >
              {listEquip.map((item) => (
                <div key={item.id} className='d-flex align-items-center bg-white px-3 py-3 border border-secondary rounded' style={{ gap: 8 }} ><i className="fas fa-bars" style={{
                  cursor: "pointer",
                  color: "#000",
                }} /><span style={{ textTransform: 'capitalize' }} >{item.name}</span></div>
              ))}
            </ReactSortable>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {onSubmit && (<Button onClick={() => onSubmit && onSubmit(listEquip)} >
          {textButton}
        </Button>)}
      </Modal.Footer>
    </Modal >
  )
}

export default EquipOrderModal