
export const events = [
  {
    id: '1',
    start: new Date('2022-10-21 13:00:00'),
    end: new Date('2022-10-21 15:00:00'),
    title: 'Cumpleaños del Fernando',
    notes: 'Hay que comprar el pastel'
  },
  {
    id: '2',
    start: new Date('2022-09-21 13:00:00'),
    end: new Date('2022-09-21 15:00:00'),
    title: 'Cumpleaños del America',
    notes: 'Aluna nota pora America'
  }
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [ ...events ],
  activeEvent: null
};

export const calendarWithActiveEventState = {
  isLoadingEvents: false,
  events: [ ...events ],
  activeEvent: { ...events[0] }
};





