import React, { useState ,Fragment , useEffect} from 'react'
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useInit } from '../../Common/Hooks/useInit';
import { ax } from '../../Common/Utils/AxiosCustom';

//react-select
import CreatableSelect from 'react-select/creatable';
import swal from 'sweetalert';


type OptionType = {
  value: string;
  label: string;
};



type Props = {
  options?: Array<OptionType>;
  value?: string;
  name?: string;
  label?: string;
  preSelect?: string;
  urlGet:string; //url para optener la data para el select
  urlAdd:string; //url para tener la funcion de guardar el nuevo elemento
  onChange?: (event: any) => void;
  onChangeString?: (e: string) => void;
 
}




export const SelectWithAdd = (props: Props) => {

  const {capitalize: caps } = useFullIntl();
  const {onChangeString } = props;
  const [init, doInit] = useInit();
  const [value, setValue] = useState<string>();

  const [options, setOptions] = useState<OptionType[]>([]);
  const [optionSelected, setOptionSelected] = useState<OptionType>();
  const [isLoading , setIsLoading] = useState(false);
  const formatCreateLabel = (inputValue:any) => `Crear item  ${inputValue}`;

  useEffect(() => {
      if (!init && props.value) {
        doInit();
        setValue(props.value);
        if (onChangeString) { onChangeString(props.value); }
      }
  }, [init, doInit, props.value, onChangeString,setValue]);


 //init get db options array
 useEffect(() => {

   async function getOption() {
      await ax.get(props.urlGet).then( res => {
        let data = res.data?.map((o:any, i:number) => {
          return { label: caps(o.nombre) , value: o.codigo }
        });
        setOptions(data);
        }).catch( e => {
      });
    }
   getOption();

 },[]);
      


const onChange = (event: any) => {
  if(event !== undefined){
    setValue(event);
    setOptionSelected(event);
    if (props.onChange) { props.onChange(event.value); }
    if (props.onChangeString) { props.onChangeString(event.value); }
  }
}





//create new option value
const onCreateOption = async (inputValue?: any) => {

 swal("Estas seguro de agregar una nueva marca?", {
    buttons: {
      yes: {
        text: "Confirmar",
        value: "ok"
      },
      no: {
        text: "Cancelar",
        value: "no"
      }
    }
  }).then( async (value) => {
    if (value === "ok") {
        setIsLoading(true);
        await ax.post(props.urlAdd, {nombre:inputValue.toUpperCase()} ).then( res => {
          //get new data option of db
          ax.get(props.urlGet).then( res => {
            //parcear la data para los values
            let data = res.data?.map((o:any, i:number) => {
              return { label: caps(o.nombre) , value: o.codigo }
            });
               
            /*deberia ir el filter*/
            let newOption = data?.filter((o:any,i:number) => {
              if(o.label.toUpperCase() === inputValue.toUpperCase()){
                return { label: caps(o.label) , value: o.value }
              }
            });

            if(newOption){
             onChange(newOption[0]);
            }

            setOptions(data);
            setIsLoading(false);
          });
         
        }).catch((error) => {
           setIsLoading(false);
        })
    }else{
      setIsLoading(false);
    }
  });

/*
  if (window.confirm("Estas seguro de agregar una nueva marca?")){
    //set new option on db
    setIsLoading(true);
    await ax.post(props.urlAdd, {nombre:inputValue.toUpperCase()} ).then( res => {
      //get new data option of db
      ax.get(props.urlGet).then( res => {
        //parcear la data para los values
        let data = res.data?.map((o:any, i:number) => {
          return { label: caps(o.nombre) , value: o.codigo }
        });
           
      
        let newOption = data?.filter((o:any,i:number) => {
          if(o.label.toUpperCase() === inputValue.toUpperCase()){
            return { label: caps(o.label) , value: o.value }
          }
        });

        if(newOption){
         onChange(newOption[0]);
        }

        setOptions(data);
        setIsLoading(false);
      });
     
    }).catch((error) => {
       setIsLoading(false);
       console.log(error);
    })
  } else{
    setIsLoading(false);
  }*/
};
   

  return (
    <Fragment>
       {props.label && <label><b>{caps(props.label)}:</b></label>}
       
        <CreatableSelect
          name={props.name}
          options={options}
          onChange={onChange}
          isLoading={isLoading}
          onCreateOption={onCreateOption}
          value={optionSelected}
          formatCreateLabel={formatCreateLabel}
        />
    </Fragment>
  );
};



