import React from "react";
import { useState, useCallback, ReactNode, Fragment, useMemo } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

export interface BagEvaluateCondition {
  condition: boolean;
  message: string;
}

export const useErrorBag = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const pushCallback = useCallback(
    (...errors: string[]) => setErrors((state) => [...state, ...errors]),
    []
  );
  const clearCallback = useCallback(() => setErrors([]), []);
  const overlayCallback = useCallback(
    (element: ReactNode, zIndex?: number) =>
      errors.length > 0 ? (
        <OverlayTrigger
          overlay={
            <Popover id="{Utils.getGuid()}" style={{ zIndex }}>
              <Popover.Content>
                {errors.map((x, i) => (
                  <Fragment key={i}>
                    <span>{x}</span>
                    <br />
                  </Fragment>
                ))}
              </Popover.Content>
            </Popover>
          }
        >
          <span className="d-inline-block">{element}</span>
        </OverlayTrigger>
      ) : (
        element
      ),
    [errors]
  );
  const evaluateCallback = useCallback(
    (conditions: BagEvaluateCondition[]) => {
      clearCallback();
      let result = true;
      const evaluationErrors: string[] = [];
      for (const c of conditions) {
        if (!c.condition) {
          result = false;
          evaluationErrors.push(c.message);
        }
      }
      if (evaluationErrors.length > 0) {
        pushCallback(...evaluationErrors);
      }
      return result;
    },
    [pushCallback, clearCallback]
  );

  const bag = useMemo(() => {
    return {
      push: pushCallback,
      clear: clearCallback,
      overlay: overlayCallback,
    };
  }, [pushCallback, clearCallback, overlayCallback]);

  const bagEvaluate = useMemo(() => {
    return { bag, evaluate: evaluateCallback };
  }, [bag, evaluateCallback]);

  return bagEvaluate;
};
