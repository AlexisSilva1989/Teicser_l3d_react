import React from "react";
import { BounceLoader } from "react-spinners";

export const LoadingSpinner = (props: { mensaje?: string }) => {
  return (
    <>
      <BounceLoader
        color="var(--primary)"
        css={{ margin: "2.5rem auto" } as any}
        size={64}
      />
    </>
  );
};
