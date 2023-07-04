import { createSlice } from '@reduxjs/toolkit';
import omit from 'lodash/omit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  board: {
    cards: {
      "9d98ce30-3c51-4de3-8537-7a4b663ee3af": {
        "id": "9d98ce30-3c51-4de3-8537-7a4b663ee3af",
        "name": "Jardin de nieve",
        "description": "Martes 17/08 10:00hs AM",
        "reporter": [],
        "assignee": [
          {
            "id": "473d2720-341c-49bf-94ed-556999cf6ef7",
            "avatar": "https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_2.jpg",
            "name": "Soren Durham"
          }
        ],
        "due": [
          null,
          null
        ],
        "attachments": [],
        "comments": [],
        "completed": true
      }},
    columns: [
      {
        "id": "8cd887ec-b3bc-11eb-8529-0242ac130003",
        "name": "today",
        "cardIds": [
          "9d98ce30-3c51-4de3-8537-7a4b663ee3af"
        ]
      },
      {
        "id": "23008a1f-ad94-4771-b85c-3566755afab7",
        "name": "tomorrow",
        "cardIds": [
          
        ]
      },
      {
        "id": "37a9a747-f732-4587-a866-88d51c037641",
        "name": "week",
        "cardIds": []
      },
      {
        "id": "4ac3cd37-b3e1-466a-8e3b-d7d88f6f5d4f",
        "name": "Clases Vendidas",
        "cardIds": [
          
        ]
      }
    ],
    columnOrder: ["8cd887ec-b3bc-11eb-8529-0242ac130003","23008a1f-ad94-4771-b85c-3566755afab7","37a9a747-f732-4587-a866-88d51c037641","4ac3cd37-b3e1-466a-8e3b-d7d88f6f5d4f"],
  },
};

const slice = createSlice({
  name: 'kanban',
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

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = objFromArray(board.cards);
      const columns = objFromArray(board.columns);
      const { columnOrder } = board;
      state.board = {
        cards,
        columns,
        columnOrder,
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn,
      };
      state.board.columnOrder.push(newColumn.id);
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter((id) => id !== cardId);
      state.board.cards = omit(state.board.cards, [cardId]);
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;
      const deletedColumn = state.board.columns[columnId];

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
      state.board.cards = omit(state.board.cards, [...deletedColumn.cardIds]);
      state.board.columnOrder = state.board.columnOrder.filter((c) => c !== columnId);
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

export function getBoard() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      console.log('getBoard');
      const response = await axios.get('/api/events/');
      const events = response.data;
      console.log(events);
      const board = {
        cards: events.map(e => ({
          ...e,
          reporter: e.assignedUsers,
          assignee: [...e.students, ...e.clients],
          name: e.title,
          due: [new Date(e.start), new Date(e.end)],
          attachments: [],
          comments: [],
          completed: e.payed

        })),
        columns: [
          {
            id: 0,
            name: "today",
            cardIds: events.filter(e => new Date(e.start).getDate() === new Date().getDate()).map(e => e.id)
          },
          {
            id: 1,
            name: "tomorrow",
            cardIds: events.filter(e => e.start === new Date(new Date().getDate() + 1)).map(e => e.id)
          },
          {
            id: 2,
            name: "this_week",
            cardIds: events.map(e => e.id)
          },
        ],
        columnOrder: [0, 1, 2],
      }
      console.log(board);
      dispatch(slice.actions.getBoardSuccess(board));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createColumn(newColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/new', newColumn);
      dispatch(slice.actions.createColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateColumn(columnId, updateColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/update', {
        columnId,
        updateColumn,
      });
      dispatch(slice.actions.updateColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteColumn(columnId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/kanban/columns/delete', { columnId });
      dispatch(slice.actions.deleteColumnSuccess({ columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder) {
  return () => {
    dispatch(slice.actions.persistColumn(newColumnOrder));
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns) {
  return () => {
    dispatch(slice.actions.persistCard(columns));
  };
}

// ----------------------------------------------------------------------

export function addTask({ card, columnId }) {
  return () => {
    dispatch(slice.actions.addTask({ card, columnId }));
  };
}

// ----------------------------------------------------------------------

export function deleteTask({ cardId, columnId }) {
  return (dispatch) => {
    dispatch(slice.actions.deleteTask({ cardId, columnId }));
  };
}
