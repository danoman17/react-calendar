const { render, screen, getByLabelText, fireEvent } = require('@testing-library/react');
const { FabDelete } = require('../../../src/calendar/components/FabDelete');
const { useCalendarStore } = require('../../../src/hooks/useCalendarStore');

jest.mock('../../../src/hooks/useCalendarStore');

describe('Pruebas en <FabDelete />', () => {

  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => jest.clearAllMocks());
  beforeEach(() => jest.clearAllTimers());


  test('debe de mostrar el componente correctamente ', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: false
    });

    render(<FabDelete />);

    const btn = screen.getByLabelText('btn-delete');

    // screen.debug()

    expect(btn.classList).toContain('btn');
    expect(btn.classList).toContain('btn-danger');
    expect(btn.classList).toContain('fab-danger');
    expect(btn.style.display).toBe('none');
  });


  test('debe de mostrar el boton si hay un evento activo ', () => {

    useCalendarStore.mockReturnValue({
      hasEventSelected: true
    });

    render(<FabDelete />);

    const btn = screen.getByLabelText('btn-delete');

    fireEvent.click( btn );

    expect(mockStartDeletingEvent).toHaveBeenCalled();
  });



});
