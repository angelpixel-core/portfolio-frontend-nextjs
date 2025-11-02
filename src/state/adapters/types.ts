export interface StateAdapterContract {
  useStoreSelector: Function;
  useStoreDispatch?: Function;
  Provider: React.FC<{ children: React.ReactNode }>;
}
