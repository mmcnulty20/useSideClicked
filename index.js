'use strict'

const { useRef, useCallback } = require('react');

// simple check for which is passed as 'Options' does not have a 'current' key
function isRef(obj) { return !!obj && "current" in obj };

function useSideClicked(callback, refOrOptions) {
  const [options, passedRef] = !refOrOptions
    ? [{}] : isRef(refOrOptions)
      ? [{}, refOrOptions] : [refOrOptions];
  const side = options.side || "horizontal";

  // allows for using the same value/component as a ref created earlier 
  // or in a different component/scope
  const containerRef = useRef(passedRef?.current || null);

  const handleSide = useCallback((event) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    
    const { offsetX, offsetY } = event.nativeEvent;

    const arg1 = side === "vertical" || side === "v"
      ? offsetY <= bounds.height / 2 : offsetX <= bounds.width / 2;
    const arg2 = side === "both" || side === "b"
      ? offsetY <= bounds.height / 2 : undefined;

    callback(arg1, arg2);
  }, [callback, side]);

  useEffect(() => {
    // update ref element if the passed value has changed
    if (passedRef?.current) containerRef.current = passedRef.current;
  }, [passedRef]);

  return { containerRef, handleSide };
};

// allow importing as default or destructured import
const mod = module.exports = useSideClicked;
mod.useSideClicked = useSideClicked;
 