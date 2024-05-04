import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../../src/store';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';

// Creamos una funcion para poder crear un store de manera "artificial"
const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: { ...initialState }
    }
  })
}

describe('Pruebas de useAuthStore ', () => {

  /* 
    esto es importante, pues no se sabe si otra 
    prueba dejo grabado algo mas en el localStae 
  */
  beforeEach(() => localStorage.clear());

  test('debe de regresar los valores por defecto ', () => {

    // creamos nuestro estado "artificial"
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });


    expect(result.current).toEqual({
      status: 'checking',
      errorMessage: undefined,
      user: {},
      checkAuthToken: expect.any(Function),
      startLogin: expect.any(Function),
      startLogout: expect.any(Function),
      startRegister: expect.any(Function),
    });


  });

  test('startLogin debe de realizar el login correctamente ', async () => {

    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });

    await act(async () => {
      await result.current.startLogin({ ...testUserCredentials })
    });


    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: "Daniel", uid: "66148ea6996e5d827c605dd4", }
    });


    expect(localStorage.getItem('token')).toEqual(expect.any(String));
    expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

  });

  test('startLogin debe de fallar la autenticacion ', async () => {

    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });

    await act(async () => {
      await result.current.startLogin({ email: "algo@google.com", password: "1234567898" })
    });

    const { errorMessage, status, user } = result.current;


    expect(localStorage.getItem('token')).toBeNull();

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: 'Credenciales Incorrectas',
      status: 'not-authenticated',
      user: {}
    });

    await waitFor(
      () => expect(result.current.errorMessage).toBe(undefined)
    )

  });

  test('startRegister debe de crear un usuario ', async () => {


    const newUser = { email: "algo@google.com", password: "1234567898", name: "Test User" };
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: "123458",
        name: "Daniel",
        token: "ALGUN TOKEN",
      }
    })

    await act(async () => {
      await result.current.startRegister(newUser)
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: "Daniel", uid: "123458", }
    });

    spy.mockRestore();


  });

  test('startRegister debe de fallar la creación ', async () => {
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });


    await act(async () => {
      await result.current.startRegister({ ...testUserCredentials })
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: "El usuario ya existe con ese correo",
      status: 'not-authenticated',
      user: {}
    });

  });

  test('checkAuthToken debe de fallar si no hay token ', async () => {

    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });


    await act(async () => {
      await result.current.checkAuthToken()
    });

    const { errorMessage, status, user } = result.current;

    expect( { errorMessage, status, user } ).toEqual({
      errorMessage: undefined, 
      status: 'not-authenticated',
      user: {}
    });

  });
  
  test('checkAuthToken debe de autenticar el usuario si hay un token', async() => {
    
    const { data } = await calendarApi.post('/auth', testUserCredentials);
    localStorage.setItem( 'token',data.token);

    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={mockStore} > {children} </Provider>
    });


    await act(async () => {
      await result.current.checkAuthToken()
    });

    const { errorMessage, status, user } = result.current;

    expect( { errorMessage, status, user } ).toEqual({
      errorMessage: undefined,
        status: 'authenticated',
        user: { name: 'Daniel', uid: '66148ea6996e5d827c605dd4' }
    });

  });

});
