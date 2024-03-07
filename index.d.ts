/// <reference types="react" />

type _Horz = "horizontal" | "h";
type _Vert = "vertical" | "v";
type _Diag = "both" | "b";

type Side = _Horz | _Vert | _Diag;

export interface Options<E extends Element, S extends Side = "horizontal"> {
  ref?: React.MutableRefObject<E>;
  side?: S;
}

type UseSideCallback<S extends Side = "horizontal"> = S extends _Diag
  ? (isLeftSide: boolean, isTopSide: boolean) => void
  : S extends _Horz
    ? (isLeftSide: boolean) => void
    : (isTopSide: boolean) => void;

type UseSideReturn<E extends Element = HTMLElement> = {
  containerRef: React.MutableRefObject<E | null>;
  handleSide: React.MouseEventHandler;
};

export function isRef<E extends Element>(obj?: React.MutableRefObject<E> | Options<E>): obj is React.MutableRefObject<E>;

export function useSideClicked(callback: UseSideCallback): UseSideReturn<Element>;
export function useSideClicked<E extends Element = HTMLElement>(callback: UseSideCallback, passedRef: React.MutableRefObject<E>): UseSideReturn<E>;
export function useSideClicked<
  E extends Element = HTMLElement,
  O extends Options<E> = Options<E>,
  S extends Side = [O] extends [Options<E, infer _S>]
    ? _S : "horizontal"
>(callback: UseSideCallback<S>, options: O): UseSideReturn<E>;
