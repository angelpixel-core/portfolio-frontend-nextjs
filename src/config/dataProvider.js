import {
  NavigationItem,
  ContactPoint,
} from "@/models";
import { IS_DEV } from "@/config/env";

import * as mockProviders from "@/data/mocks";
import * as apiProviders from "@/data/api";

export const DataProvider = IS_DEV ? mockProviders : apiProviders;

// Ejemplo de uso:
export const NavigationItemProvider = IS_DEV
  ? mockProviders.NavigationItem
  : apiProviders.NavigationItem;
