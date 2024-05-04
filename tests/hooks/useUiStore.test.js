import { renderHook } from "@testing-library/react";
import { useUiStore } from "../../src/hooks/useUiStore";
import { Provider } from "react-redux";
import { uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";


// Creamos una función para poder crear un store de manera "artificial"
const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer
    },
    preloadedState: {
      ui: { ...initialState }
    }
  })
}

describe('Pruebas en useUiStore', () => {


  test('debe de regresar los valores por defecto ', () => {

    // creamos nuestro estado "artificial"
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });

    expect(result.current).toEqual({
      isDateModalOpen: false,
      openDateModal: expect.any(Function),
      closeDateModal: expect.any(Function)
    });

  });

  test('openDateModal debe de colocar true en el isDateModalOpen ', () => {

    // creamos nuestro state "artificial"
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });


    // al momento de desestructurar, se obtienen variables que se ... 
    // ...consideran primitivas, y por lo tanto, estas no cambian
    const { isDateModalOpen, openDateModal } = result.current;

    act(() => {

      openDateModal();

    });

    // console.log({result: result.current, isDateModalOpen});

    expect(result.current.isDateModalOpen).toBeTruthy();

  });

  test('closeDateModal debe de colocar false en isDateModalOpen ', () => {

    // creamos nuestro state "artificial"
    const mockStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });

    const { closeDateModal } = result.current;

    act(() => {
      closeDateModal();
    });

    expect(result.current.isDateModalOpen).toBeFalsy();

  });




});
