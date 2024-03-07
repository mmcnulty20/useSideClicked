## `useSideClicked` hook

This is a small and simple React hook that could be useful across different React projects where behavior
needs to vary based on the location clicked within an element.

I've used it to experiment with publishing my own packages, so let me know if you see any issues.

### Setup
(Note: ensure these are accurate as package is published)
Install with your favorite package manager with `npm -i use-side-clicked` or `yarn install use-side-clicked`.

### Basic Usage
```typescript
// ...
import * as useSideClicked from "use-side-clicked";
// or `import { useSideClicked } from "use-side-clicked";`

export const ExampleElement = () => {
  const [recentlyClickedSide, setRecentlyClickedSide] = useState();
  
  const handleSideClick = useCallback((isLeftSide: boolean) => {
    const sideClicked = isLeftSide ? "left" : "right";
    console.log(`clicked ${sideClicked} side!`);
    setRecentlyClickedSide(sideClicked);
  }, []);

  const { containerRef, handleSide } = useSideClicked(handleSideClick);

  return (
    <div
      ref={containerRef}
      onClick={handleSide}
      style={{
        height: "100px",
        width: "100px",
        backgroundColor: recentlyClickedSide && (recentlyClickedSide === "left" ? "red" : "blue")
      }}
    />
  )
};
```
This will create a simple square `div` that will change color when you click the left or right side.
`useSideClick` is available both as a named export and default export, depending on preference when importing.

### Advanced Usage

#### Ref Argument

Sometimes you'll need to utilize elements that have already created a ref elsewhere or in a different 
context. Passed refs should be `MutableRefObject<T | null>` where `T extends Element` (such as `HTMLElement`
or more specific types like `SVGSVGElement`).

`useSideClicked` ensures the `Element` at `containerRef.current` is the same as the elements of any
passed refs, allowing you to ignore the `containerRef` return and continue using a pre-existing ref
should it already exist.

```typescript
// ...
import { useSideClicked } from "use-side-clicked";

export const ExampleElement = () => {
  const { ctxRef } = useContext(RefContainingContext);
  
  const handleSideClicked = useCallback((isLeftSide: boolean) => {
    if (isLeftSide) {
      // handle all top-side clicks
    } else {
      // handle right-side clicks
    }
  }, []);

  const { handleSide } = useSideClicked(handleSideClicked, ctxRef);

  return (
    <div onClick={handleSide} ref={ctxRef}>Click</div>
  );
};
```

#### Options Argument

While `useSideClicked` defaults to determining if you've clicked the right or left side, you can use
the `options` argument to provide a different configuration. Options are `vertical` (or `v`), `horizontal` (or `h`) (which is the **default**), and `both` (or `b`) to potentially handle either direction or break
handling into quadrants.

`options` takes in optional values for `side` and `ref` (see above for some information on ref handling).

```typescript
// ...
import { useSideClicked } from "use-side-clicked";

export const ExampleElement = () => {
  const handleSideClicked = useCallback((isLeftSide: boolean, isTopSide: boolean) => {
    if (isTopSide) {
      // handle all top-side clicks
    }
    if (!isLeftSide && !isTopSide) {
      // handle clicks in the bottom-right quadrant specifically
    }
  }, []);

  const { containerRef, handleSide } = useSideClicked({
    side: "both",
    // ref: ctxRef, // if you also need to use a pre-existing ref as described above
  });

  return (
    <div onClick={handleSide} ref={containerRef}>Click</div>
  );
};
```