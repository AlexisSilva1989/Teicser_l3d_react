import React, { Fragment } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { EnhancedColorOption } from "./ColorOption";

export const ColorOptions = () => {
  const colors = [
    "background-blue",
    "background-blue",
    "background-red",
    "background-purple",
    "background-info",
    "background-green",
    "background-dark",
  ];

  const gradients = [
    "background-grd-blue",
    "background-grd-red",
    "background-grd-purple",
    "background-grd-info",
    "background-grd-green",
    "background-grd-dark",
  ];

  const images = [
    "background-img-1",
    "background-img-2",
    "background-img-3",
    "background-img-4",
    "background-img-5",
    "background-img-6",
  ];

  const colorOptions = (
    <div>
      <h6 className=" text-dark">Background Color</h6>
      <div className="theme-color background-color flat">
        {colors.map((c, i) => (
          <EnhancedColorOption key={i} color={c} />
        ))}
      </div>
      <h6 className=" text-dark">Background Gradient</h6>
      <div className="theme-color background-color gradient">
        {gradients.map((c, i) => (
          <EnhancedColorOption key={i} color={c} />
        ))}
      </div>
      <h6 className=" text-dark">Background Image</h6>
      <div className="theme-color background-color image">
        {images.map((c, i) => (
          <EnhancedColorOption key={i} color={c} />
        ))}
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className="config-scroll">
        <PerfectScrollbar>{colorOptions}</PerfectScrollbar>
      </div>
    </Fragment>
  );
};
