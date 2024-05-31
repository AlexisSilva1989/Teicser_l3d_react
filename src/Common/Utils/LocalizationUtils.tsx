import React from "react";
import { FormattedMessage, IntlShape } from "react-intl";

export const getMessage = (id: string, values?: any) => (
  <FormattedMessage id={id} values={values} />
);

export const localizeIntl = (intl: IntlShape) => {
  return (id: string, args: any = null) => intl.formatMessage({ id }, args);
};
