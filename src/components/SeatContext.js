import React from 'react'

export const SeatContext = React.createContext();

const initialState = {
  hasLoaded: false,
  seats: null,
  numOfRows: 0,
  seatsPerRow: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'receive-seat-info-from-server':
        console.log(action)
        return {
            ...state,
            hasLoaded: true,
            seats: action.seats,
            numOfRows: action.numOfRows,
            seatsPerRow: action.seatsPerRow
        }
      case 'mark-seat-as-purchased':
        console.log(action)
        return {
          ...state,
          seats: action.newSeats
          
        }
    default:
        throw new Error(`unrecognized action: ${action.type}`)
  }
}

export const SeatProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const receiveSeatInfoFromServer = (data) => {
    dispatch({
      type: "receive-seat-info-from-server",
      ...data,
    });
  };

  const markSeatPurchased = (newSeats) => {
    dispatch({
      type: 'mark-seat-as-purchased',
      newSeats: newSeats
    })
  }

  return (
    <SeatContext.Provider
      value={{
        state,
        actions: {
          receiveSeatInfoFromServer,
          markSeatPurchased,
        },
      }}
    >
      {children}
    </SeatContext.Provider>
  );
};
