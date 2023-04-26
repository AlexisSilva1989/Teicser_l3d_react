import { Fragment, useCallback, useEffect, useState } from 'react'
import React from 'react'
import { useFullIntl } from '../../Common/Hooks/useFullIntl'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import { $m } from '../../Common/Utils/Reimports'
import format from 'date-fns/format'
interface Props {
  label?: string
  name?: string
  value?: string
  minDate?: string
  maxDate?: string
  errors?: string[]
  readonly?: boolean
  className?: string
  disabled?: boolean
  onChange?: (e: string) => void
}
registerLocale('es', es)

export const Datepicker = (props: Props) => {
  const innerClasses = ['form-control msig-datepicker-input']
  if (props.className) {
    innerClasses.push(props.className)
  }
  if (props.readonly) {
    innerClasses.push('readonly')
  }
  const iconClasses = ['input-group-prepend msig-datepicker-icon']
  if (props.readonly) {
    iconClasses.push('readonly')
  }

  const valueDateInit = props.value
    ? $m(props.value, 'DD-MM-YYYY').toDate()
    : undefined

  const [startDate, setStartDate] = useState<Date | undefined>(valueDateInit)
  const { capitalize: caps } = useFullIntl()
  const { onChange } = props

  const setDate = useCallback(
    (e) => {
      if (onChange != null) {
        const value = e ? format(e, 'dd-MM-yyyy') : ''
        onChange(value)
      }
    },
    [onChange]
  )

  return (
    <div className="msig-datepicker">
      {props.label && (
        <label>
          <b>{caps(props.label)}:</b>
        </label>
      )}
      <div className="input-group">
        <div className={iconClasses.join(' ')}>
          <i className="fas fa-calendar-alt input-group-text" />
        </div>
        <DatePicker
          name={props.name}
          disabled={props.disabled}
          readOnly={props.readonly}
          minDate={
            props.minDate ? $m(props.minDate, 'DD-MM-YYYY').toDate() : undefined
          }
          maxDate={
            props.maxDate ? $m(props.maxDate, 'DD-MM-YYYY').toDate() : undefined
          }
          selected={
            props.value ? $m(props.value, 'DD-MM-YYYY').toDate() : startDate
          }
          onChange={(date: Date) => {
            setStartDate(date)
          }}
          onSelect={setDate}
          dateFormat="dd-MM-yyyy"
          autoComplete="off"
          locale="es"
          className={innerClasses.join(' ')}
          // value={props.value}
          // strictParsing = {true}
        />
      </div>
      {props.errors && props.errors.length > 0 && (
        <div>
          {props.errors.map((e, i) => {
            return (
              <Fragment key={i}>
                <small className="text-danger" key={i}>
                  {e}
                </small>
                <br />
              </Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

// const { capitalize: caps } = useFullIntl();
// const datepicker = useRef<HTMLInputElement>(null);
// const { onChange } = props;

// const setDate = useCallback(
// 	(e: string) => {
// 		if (onChange != null) {
// 			onChange(e);
// 		}
// 	},
// 	[onChange]
// );

// const localizedDays = useMemo(() => {
// 	function localize(which: string) {
// 		return caps('labels:days.short.' + which);
// 	}
// 	return [localize('sunday'), localize('monday'), localize('tuesday'), localize('wednesday'), localize('thursday'), localize('friday'), localize('saturday')];
// }, [caps]);

// const localizedMonths = useMemo(() => {
// 	function localize(which: string) {
// 		return caps('labels:months.' + which);
// 	}
// 	return [
// 		localize('january'),
// 		localize('february'),
// 		localize('march'),
// 		localize('april'),
// 		localize('may'),
// 		localize('juny'),
// 		localize('july'),
// 		localize('august'),
// 		localize('september'),
// 		localize('october'),
// 		localize('november'),
// 		localize('december')
// 	];
// }, [caps]);

// useEffect(() => {
// 	if (props.readonly) {
// 		return;
// 	}
// 	$(datepicker.current!).datepicker({
// 		dateFormat: 'dd-mm-yy',
// 		onSelect: setDate,
// 		showOtherMonths: true,
// 		selectOtherMonths: true,
// 		firstDay: 1,
// 		dayNamesMin: localizedDays,
// 		monthNames: localizedMonths
// 	}).attr("autocomplete", "off");
// }, [setDate, props.readonly, localizedDays, localizedMonths]);

// const innerClasses = ['form-control msig-datepicker-input'];
// if(props.className) { innerClasses.push(props.className); }
// if(props.readonly) { innerClasses.push('readonly'); }

// const iconClasses = ['input-group-prepend msig-datepicker-icon'];
// if(props.readonly) { iconClasses.push('readonly'); }

// return <div className='msig-datepicker'>
// 	{props.label && <label>
// 		<b>{caps(props.label)}:</b>
// 	</label>}
// 	<div className='input-group'>
// 		<div className={iconClasses.join(' ')}>
// 			<i className='fas fa-calendar-alt input-group-text' />
// 		</div>
// 		<input type='text' style={props.readonly || props.disabled ? {} : { cursor: 'pointer'}} className={innerClasses.join(' ')} ref={datepicker} value={props.value} name={props.name} disabled={props.disabled} readOnly={props.readonly} autoComplete={"off"}/>
// 	</div>
// 	{props.errors && props.errors.length > 0 && <div>
// 		{props.errors.map((e, i) => {
// 			return <Fragment key={i}>
// 				<small className='text-danger' key={i}>
// 					{e}
// 				</small>
// 				<br />
// 			</Fragment>;
// 		})}
// 	</div>}
// </div>;
