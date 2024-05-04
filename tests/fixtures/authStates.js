

export const initialState = {
  status: 'checking', 
  user:{},
  errorMessage: undefined,
}

export const authenticatedState = {
  status: 'checking', 
  user:{
    uid: 'abc',
    name: 'Daniel'
  },
  errorMessage: undefined,
}


export const notAuthenticatedState = {
  status: 'not-authenticated', 
  user:{},
  errorMessage: undefined,
}