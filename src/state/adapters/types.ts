import type { FC, ReactNode } from "react";

export interface StateAdapterContract {
  useStoreSelector: Function;
  useStoreDispatch?: Function;
  Provider: FC<{ children: ReactNode }>;
}
