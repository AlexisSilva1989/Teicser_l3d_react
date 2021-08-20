import React from 'react';

import { industries, titlesByIndustries, typeIndustries } from "../../Config/titleIndustries.config";

const industryLoggedId = localStorage.getItem('industry') ?? "2";

export const useTitle = () => {
  const industryLogged: typeIndustries = industries[parseInt(industryLoggedId) - 1] as typeIndustries;
  const titles = titlesByIndustries[industryLogged];
	return titles;
};