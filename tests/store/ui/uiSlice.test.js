import { onCloseDateModal, onOpenDateModal, uiSlice } from '../../../src/store/ui/uiSlice';

describe('Pruebaqs en uiSlice', () => {
  
  test('debe de regresar el estado por defecto ', () => {

    expect( uiSlice.getInitialState().isDateModalOpen ).toBeFalsy();

    // // podemos hacerlo tambien de la siguiente manera:
    // expect( uiSlice.getInitialState()).toEqual({ isDateMOdelOPen: false });

  });

  test('debe de cambiar el isDateModalOpen correctamente ', () => {
    
    let state = uiSlice.getInitialState();
    state = uiSlice.reducer( state, onOpenDateModal() );
    expect(state.isDateModalOpen).toBeTruthy();

    state = uiSlice.reducer(state, onCloseDateModal());
    expect(state.isDateModalOpen).toBeFalsy();

  })
  
  

})
