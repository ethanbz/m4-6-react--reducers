import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import { BookingContext } from './BookingContext'
import { SeatContext } from './SeatContext'

const useStyles = makeStyles({
    table: {
        padding: '100px',
        color: 'blue',
        width: '300px',
        marginLeft: '150px'
    },
    dialog: {
        size: '40px',
        padding: '30px'
    }
})

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, open, row, seat, price, seatId, creditCard, setCreditCard, 
        expiration, setExpiration, attemptPurchase, error } = props;

  
    const handleClose = () => {
      onClose();
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };


  
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle className={classes.dialog} id="simple-dialog-title">Purchase ticket</DialogTitle>
        <p style={{margin: '-20px 0 10px 30px'}} >You're purchasing 1 ticket for the price of ${price}</p>

        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Row</TableCell>
                    <TableCell>Seat</TableCell>
                    <TableCell>Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>{row}</TableCell>
                    <TableCell>{seat}</TableCell>
                    <TableCell>${price}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <Form>
            <h4 style={{marginBottom: 15}} >Enter payment details</h4>
            <TextField value={creditCard} onChange={(e) => setCreditCard(e.target.value)} id="outlined-basic" label="Credit card" variant="outlined" />
            <TextField value={expiration} onChange={(e) => setExpiration(e.target.value)} style={{width: 100, margin: '0 20px 15px'}} id="outlined-basic" label="Expiration" variant="outlined" />
            <Button onClick={() => attemptPurchase({seatId, creditCard, expiration})} style={{height: 55, width: 130}} variant="contained" color="primary">
                Purchase
            </Button>
            {error !== null ? <h5 style={{color: 'red', marginBottom: -16}} >{error}</h5> : <></>}
        </Form>
      </Dialog>
    );
  }
  
  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
  };
  let row, seat, cost;
export const PurchaseModal = () => {
const {
    state: { price, selectedSeatId },
    actions: { cancelBookingProcess, ticketRequest, ticketFailure, ticketSuccess }
} = useContext(BookingContext)
const {
    state: { seats },
    actions: { markSeatPurchased }
} = useContext(SeatContext)
const [creditCard, setCreditCard] = useState('')
const [expiration, setExpiration] = useState('')
const [error, setError] = useState(null)



    if (selectedSeatId !== null) {
        row = selectedSeatId.slice(0,1)
        seat = selectedSeatId.slice(2,3)
        cost = price
    }

    const attemptPurchase = async (data) => {
        console.log(data)
        ticketRequest()
        const response = await fetch('/api/book-seat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        if (response.success === undefined) {
            console.log(response)
            setError(response.message)
            ticketFailure(response)
        } else {
            ticketSuccess()
            const newSeats = {...seats, [selectedSeatId]: {price: price, isBooked: true}}
            markSeatPurchased(newSeats)
            setCreditCard('')
            setExpiration('')
            setError(null)
        }
    }


  const handleClose = () => {
    cancelBookingProcess();
    setCreditCard('')
    setExpiration('')
    setError(null)
  };

  return (
    <div>
      <SimpleDialog open={selectedSeatId !== null} onClose={handleClose} row={row} 
        seat={seat} price={cost} seatId={selectedSeatId} creditCard={creditCard} 
        setCreditCard={setCreditCard} expiration={expiration} setExpiration={setExpiration}
        attemptPurchase={attemptPurchase} error={error} />
    </div>
  );
}

const Form = styled.div`
    background-color: lightgray;
    width: 600px;
    padding: 50px 0px 50px 50px;
    margin: -60px 0 30px
`
const Box = styled.div`
    background-color: blue;
    padding: 200px;
`