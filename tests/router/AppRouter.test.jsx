import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { AppRouter } from '../../src/router/AppRouter';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar',() => ({
  CalendarPage: () => <h1>CalendarPage</h1>
}));


/*
  -> Para la realización de esta prueba, lo que se tuvo que hacer es
  configurar, en el componente, una condicion para poder diferenciar
  el entorno (en este caso 'test') y asi poder saltar el renderizado
  del componente de la libreria 'Modal'

  -> Ademas de eso, se tuvo que agregar unas lineas de codigo en el 
  documento jest.config.js
*/


describe('Pruebas en <AppRouter/> ', () => {

  const mockCheckAuthToken = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  test('debe de mostrar la pantalla de carga y llamar checkAuthToken ', () => {

    useAuthStore.mockReturnValue({
      status: 'checking',
      checkAuthToken: mockCheckAuthToken
    });


    render(<AppRouter />);

    expect( screen.getByText('Cargando...') ).toBeTruthy();
    expect( mockCheckAuthToken ).toHaveBeenCalled();

  });

  test('debe de mostrar el Login en caso de no estar autenticado ', () => {

    useAuthStore.mockReturnValue({
      status: 'not-authenticated',
      checkAuthToken: mockCheckAuthToken
    });


    const { container } = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );


    expect(screen.getByText('Ingreso')).toBeTruthy();
    expect( container ).toMatchSnapshot();

  });

  test('debe mostrar el calendario si estamos autenticados ', () => {

    useAuthStore.mockReturnValue({
      status: 'authenticated',
      checkAuthToken: mockCheckAuthToken
    });


    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );

    expect( screen.getByText('CalendarPage') ).toBeTruthy();
    
  });

});
