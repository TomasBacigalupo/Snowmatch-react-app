import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  clients: [],
  client: null
};

const slice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CLIENTS
    getClientsSuccess(state, action) {
        state.isLoading = false;
        state.clients = action.payload;
      },

    // GET CLIENT
    getClientSuccess(state, action) {
      state.isLoading = false;
      state.client = action.payload;
    },

    selectClient(state, action) {
      const clientId = action.payload;
      state.client = state.clients.find(element => element.id === clientId);
    },

    // DELETE CLIENT
    deleteClientSuccess(state, action) {
      state.isLoading = false;
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },
  }
});

// Reducer
export default slice.reducer;
export const { selectClient } = slice.actions;



// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export function getClients() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/clients/');
      dispatch(slice.actions.getClientsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createClient(clientData){
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const client ={
        email:clientData.email, 
        cellphone:clientData.cellphone,
        name:clientData.name,
        lastname:clientData.lastname,
        notes:clientData.notes,
        level:clientData.level,
        image:null,
        hobbies:clientData.hobbies,
        family:clientData.family,
        work:clientData.work,
        renting:clientData.isRenting,
        tipper:clientData.isTipper,
        tip:clientData.tip,
        staysAt:clientData.staysAt,
        country:clientData.country,
        resorts:clientData.resorts

      }
      console.log(clientData);
      console.log("###############");
      console.log(client);
      const response = await axios.post('/api/clients/',client);
      dispatch(slice.actions.getClientSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

export function editClient(clientData){
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const client ={
        email:clientData.email, 
        cellphone:clientData.cellphone,
        name:clientData.name,
        lastname:clientData.lastname,
        notes:clientData.notes,
        level:clientData.level,
        image:null,
        hobbies:clientData.hobbies,
        family:clientData.family,
        work:clientData.work,
        renting:clientData.isRenting,
        tipper:clientData.isTipper,
        tip:clientData.tip,
        staysAt:clientData.staysAt,
        country:clientData.country,
        resorts:clientData.resorts
      }
      console.log(clientData);
      console.log("###############");
      console.log(client);
      const response = await axios.put('/api/clients/'+clientData.id,client);

      dispatch(slice.actions.getClientSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return error;
    }
  };
}

export function deleteClient(clientId){
  return async () => {
    try {
      const response = await axios.delete(`/api/clients/${clientId}`);
      dispatch(slice.actions.deleteClientSuccess(clientId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
};
