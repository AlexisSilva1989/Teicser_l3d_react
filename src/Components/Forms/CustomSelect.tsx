import React, { useState , useMemo ,Fragment , useEffect} from 'react'
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useInit } from '../../Common/Hooks/useInit';
import Select, { ValueType } from "react-select";


export type OptionType = {
  value: string;
  label: string;
};

type Props = {
  options?: Array<OptionType>;
  value?: string;
  name?: string;
  label?: string;
  preSelect?: string
  onChange?: (event: any) => void;
  onChangeString?: (e: string) => void;
	errors?: string[]
  disabled?: boolean
}

export const CustomSelect = (props: Props) => {

  const [selectedOption, setSelectedOption] = useState<ValueType<OptionType>>();
  const { capitalize: caps } = useFullIntl();
  const { onChangeString } = props;
  const [init, doInit] = useInit();
  const [value, setValue] = useState<string>();

  useEffect( () => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setSelectedOption(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    if (!init && props.value) {
      doInit();
      setValue(props.value);
      if (onChangeString) { onChangeString(props.value); }
    }
  }, [init, doInit, props.value, onChangeString,setValue]);


 const options= useMemo(() => {
    if (props.options) {
      return props.options.map((o, i) => {
           return { label: caps(o.label) , value: o.value }
      });
    }
    return [];
  }, [props.options, caps]);



	const optionsValue = options?.filter((o , i) => {
      if(o.value === props.preSelect){
        if(value){
          if(o.value === value)
            return { label: caps(o.label) , value: o.value }
        }else{
          if(value != "")
            return { label: caps(o.label) , value: o.value }
        }
      }else{
        if(o.value === value)
            return { label: caps(o.label) , value: o.value }
      }
	  });

  const onChange = (event: any) => {
    const val = event.value;
    setValue(val);
    if (props.onChange) { props.onChange(event); }
    if (props.onChangeString) { props.onChangeString(val); }
  }

  return (
    <Fragment>
       {props.label && <label><b>{caps(props.label)}:</b></label>}
        <Select
          name={props.name}
          value={optionsValue}
          onChange={onChange}
          options={options}
          isDisabled={props.disabled}
          styles={{
            // Fixes the overlapping problem of the component
            menu: provided => ({ ...provided, zIndex: 3 })
          }}
          // menuPortalTarget={document.body}
          // menuPosition={'absolute'}
        />

        {
          props.errors && props.errors.length > 0 && (
            <div>
            {
              props.errors.map((e, i) => <Fragment key={i}>
                <small className='text-danger' key={i}>
                  {e}
                </small>
                <br />
              </Fragment>)}
            </div>
          )
        }
    </Fragment>
  );
};





