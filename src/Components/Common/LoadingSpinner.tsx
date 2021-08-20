
import React from 'react';
import { BounceLoader } from "react-spinners"

export const LoadingSpinner = () => {
    return (<BounceLoader color='var(--primary)' css={{ margin: '2.5rem auto' } as any} size={64} />)
}