import {
  ValidatedInput,
  ValidatedForm,
} from "../../Components/Forms/ValidatedForm";
import { BaseContentView } from "./BaseContentView";
import React from "react";
import { Buttons } from "../../Components/Common/Buttons";
import { BounceLoader } from "react-spinners";

interface Props<TRaw, TData> {
  title: string;
  fields: ValidatedInput[];
  unique?: string;
  submitLabel?: string;
  path?: string;
  reset?: boolean;
  loading?: boolean;
  validations?: any;

  onReset?: () => void;
  onSubmit?: (e: TData) => void;
  onSerialize?: (e: TRaw) => TData;
}

export const FormBase = <TRaw extends unknown, TData extends unknown>(
  props: Props<TRaw, TData>
) => {
  function onSerialize(e: any) {
    return props.onSerialize!(e);
  }

  function onSubmit(e: any) {
    props.onSubmit!(e);
  }

  function onReset() {
    props.onReset!();
  }

  return (
    <BaseContentView title={props.title}>
      <div className="col-12 mb-4">
        <Buttons.Back />
      </div>
      <div className="col-12 mb-3">
        {props.loading ? (
          <BounceLoader
            css={{ margin: "2.5rem auto" } as any}
            color="var(--primary)"
            size={64}
          />
        ) : (
          <ValidatedForm
            unique={props.unique}
            path={props.path}
            submitLabel={props.submitLabel}
            fields={props.fields}
            reset={props.reset}
            validations={props.validations}
            serialize={props.onSerialize == null ? undefined : onSerialize}
            onSubmit={props.onSubmit == null ? undefined : onSubmit}
            onReset={props.onReset == null ? undefined : onReset}
          />
        )}
      </div>
    </BaseContentView>
  );
};
