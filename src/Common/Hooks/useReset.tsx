import { useState, useCallback, useEffect, useMemo } from "react";

export const useReset = (): [boolean, () => void] => {
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setReset(() => false);
  }, [reset, setReset]);

  const doReset = useCallback(() => setReset(() => true), [setReset]);

  const resultMemo = useMemo((): [boolean, () => void] => {
    return [reset, doReset];
  }, [reset, doReset]);

  return resultMemo;
};
