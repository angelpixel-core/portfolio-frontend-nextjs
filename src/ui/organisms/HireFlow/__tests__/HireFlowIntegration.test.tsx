import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import HireFlowController from "../HireFlowController";
import authPanelReducer, {
  openAuthPanel,
} from "@/state/slices/authPanel/slice";
import hireFlowPanelReducer, {
  openHireFlow,
} from "@/state/slices/hireFlowPanel/slice";

jest.mock("@/application/intents/hireFlow", () => ({
  loadHireFlowIntent: () => null,
  clearHireFlowIntent: () => undefined,
}));

const createStore = (preloadedState: {
  authPanel: {
    isOpen: boolean;
    isAuthenticated: boolean;
    user: null;
    error: null;
  };
  hireFlowPanel: {
    isOpen: boolean;
    pendingIntent: null;
  };
}) =>
  configureStore({
    reducer: {
      authPanel: authPanelReducer,
      hireFlowPanel: hireFlowPanelReducer,
    },
    preloadedState,
  });

describe("HireFlow modal exclusivity", () => {
  it("closes Hire Flow when Auth opens", async () => {
    const store = createStore({
      authPanel: {
        isOpen: false,
        isAuthenticated: false,
        user: null,
        error: null,
      },
      hireFlowPanel: {
        isOpen: true,
        pendingIntent: null,
      },
    });

    render(
      <Provider store={store}>
        <HireFlowController />
      </Provider>
    );

    store.dispatch(openAuthPanel());

    await waitFor(() => {
      expect(store.getState().hireFlowPanel.isOpen).toBe(false);
    });
  });

  it("closes Auth when Hire Flow opens", async () => {
    const store = createStore({
      authPanel: {
        isOpen: true,
        isAuthenticated: false,
        user: null,
        error: null,
      },
      hireFlowPanel: {
        isOpen: false,
        pendingIntent: null,
      },
    });

    render(
      <Provider store={store}>
        <HireFlowController />
      </Provider>
    );

    store.dispatch(openHireFlow());

    await waitFor(() => {
      expect(store.getState().authPanel.isOpen).toBe(false);
    });
  });
});
