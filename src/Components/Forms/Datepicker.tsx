import { Fragment, useCallback, useEffect, useState } from "react";
import React from "react";
import { useFullIntl } from "../../Common/Hooks/useFullIntl";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { $m } from "../../Common/Utils/Reimports";
import format from "date-fns/format";
import { FieldError } from "react-hook-form";
interface Props {
  label?: string;
  name?: string;
  value?: string;
  minDate?: string;
  maxDate?: string;
  errors?: string[];
  errorForm?: FieldError;
  readonly?: boolean;
  className?: string;
  disabled?: boolean;
  monthsShown?: number;
  inline?: boolean;
  typeDate?: string;
  onChange?: (e: string) => void;
  required?: boolean;
  withPortal?: boolean;
}
registerLocale("es", es);

export const Datepicker = (props: Props) => {
  const innerClasses = ["form-control msig-datepicker-input"];
  if (props.className) {
    innerClasses.push(props.className);
  }
  if (props.readonly) {
    innerClasses.push("readonly");
  }
  const iconClasses = [
    "input-group-prepend msig-datepicker-icon d-flex align-items-center",
  ];
  if (props.readonly) {
    iconClasses.push("readonly");
  }

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [minDateValid, setMinDateValid] = useState<Date | undefined>();
  const [maxDateValid, setMaxDateValid] = useState<Date | undefined>();
  const { capitalize: caps } = useFullIntl();
  const { onChange } = props;

  const setDate = useCallback(
    (e) => {
      if (onChange != null) {
        let value = e ? format(e, "dd-MM-yyyy") : "";
        onChange(value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    setStartDate(
      props.value !== undefined && props.value !== null && props.value !== ""
        ? $m(props.value, "DD-MM-YYYY").toDate()
        : undefined
    );
  }, [props.value]);

  useEffect(() => {
    setMaxDateValid(
      props.maxDate !== undefined &&
        props.maxDate !== null &&
        props.maxDate !== ""
        ? $m(props.maxDate, "DD-MM-YYYY").toDate()
        : undefined
    );
  }, [props.maxDate]);

  useEffect(() => {
    setMinDateValid(
      props.minDate !== undefined &&
        props.minDate !== null &&
        props.minDate !== ""
        ? $m(props.minDate, "DD-MM-YYYY").toDate()
        : undefined
    );
  }, [props.minDate]);

  return (
    <div className="msig-datepicker">
      {props.label && (
        <label>
          {props.required && <span className="text-danger">* </span>}
          <b>{caps(props.label)}:</b>
        </label>
      )}
      <div className="input-group">
        <div className={iconClasses.join(" ")}>
          <i className="fas fa-calendar-alt input-group-text d-flex" />
        </div>
        <DatePicker
          name={props.name}
          disabled={props.disabled}
          readOnly={props.readonly}
          minDate={minDateValid}
          maxDate={maxDateValid}
          selected={startDate}
          onChange={(date: Date) => {
            setStartDate(date);
          }}
          inline={props.inline}
          monthsShown={props.monthsShown}
          onSelect={setDate}
          dateFormat={props.typeDate ? props.typeDate : "dd-MM-yyyy"}
          autoComplete="off"
          locale="es"
          className={innerClasses.join(" ")}
          wrapperClassName="datepicker"
          withPortal={props.withPortal || false}
          popperClassName="msig-datepicker-popper"
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
            );
          })}
        </div>
      )}
      {props.errorForm && (
        <div>
          <small className="text-danger">{props.errorForm.message}</small>
        </div>
      )}
    </div>
  );
};

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
