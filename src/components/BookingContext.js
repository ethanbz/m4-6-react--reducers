import React from 'react'

export const BookingContext = React.createContext()

const initialState = {
    status: 'idle',
    error: null,
    selectedSeatId: null,
    price: null
}

function reducer(state, action) {
    console.log(action)
    switch (action.type) {
        case 'begin-booking-process':
            return {
                ...state,
                status: 'seat-selected',
                price: action.price,
                selectedSeatId: action.id
            }
        case 'cancel-booking-process':
            return {
                status: 'idle',
                error: null,
                selectedSeatId: null,
                price: null
            }
        case 'purchase-ticket-request':
            return {
                ...state,
                status: 'awaiting-response'
            }
        case 'purchase-ticket-failure':
            return {
                ...state,
                status: 'error',
                error: action.message

            }
        case 'purchase-ticket-success':
            return {
                status: 'purchased',
                error: null,
                selectedSeatId: null,
                price: null
            }
        case 'close-snackbar':
            return {
                ...state,
                status: 'idle'
            }
            default: 
                throw new Error(`unrecognized action: ${action.type}`)
    }
}

export const BookingProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const beginBookingProcess = (data) => {
        dispatch({
            type: 'begin-booking-process',
            ...data,
        })
    }

    const cancelBookingProcess = () => {
        dispatch({
            type: 'cancel-booking-process'
        })
    }

    const ticketRequest = () => {
        dispatch({
            type: 'purchase-ticket-request'
        })
    }

    const ticketFailure = (data) => {
        dispatch({
            type: 'purchase-ticket-failure',
            ...data,
        })
    }

    const ticketSuccess = () => {
        dispatch({
            type: 'purchase-ticket-success',
        })
    }

    const closeSnackbar = () => {
        dispatch({
            type: 'close-snackbar'
        })
    }

    return (
        <BookingContext.Provider
            value={{
                state,
                actions: {
                    beginBookingProcess,
                    cancelBookingProcess,
                    ticketRequest,
                    ticketFailure,
                    ticketSuccess,
                    closeSnackbar
                }
            }}
        >
            {children}
        </BookingContext.Provider>
    )
}