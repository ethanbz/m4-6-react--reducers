import React, { useContext } from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import seatImgSrc from '../assets/seat-available.svg'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { getRowName, getSeatNum } from '../helpers';
import { range } from '../utils';
import { SeatContext } from './SeatContext'
import { BookingContext } from './BookingContext'
import { PurchaseModal } from './PurchaseModal'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TicketWidget = () => {
  const {
    state: { numOfRows, seatsPerRow, hasLoaded, seats },
  } = useContext(SeatContext)

  const {
    state: { status },
    actions: { beginBookingProcess, closeSnackbar }
  } = useContext(BookingContext)

  return (
    <Wrapper>
      <Snackbar open={status==='purchased'} autoHideDuration={6000} onClose={() => closeSnackbar()}>
        <Alert onClose={() => closeSnackbar()} severity="success">
          Successfully purchased ticket! Enjoy the show.
        </Alert>
      </Snackbar>
      <PurchaseModal />
      {!hasLoaded && <CircularProgress className='progress' />}
      {range(numOfRows).map(rowIndex => {
        const rowName = getRowName(rowIndex);

        return (
          <Row key={rowIndex}>
            <RowLabel>Row {rowName}</RowLabel>
            <Seats key={rowIndex}>
            {range(seatsPerRow).map(seatIndex => {
              const seatId = `${rowName}-${getSeatNum(seatIndex)}`;

              return (
                <SeatWrapper id='seat' key={seatId}>
                    <Tippy2 theme="translucent" animation="fade" arrow={true} content={`Row ${rowName}, Seat ${getSeatNum(seatIndex)} - $${seats[seatId].price}`}>
                  <Button onClick={() => beginBookingProcess({price: seats[seatId].price, id: seatId})} className={seats[seatId].isBooked} disabled={seats[seatId].isBooked}>
                  <Seat className={seats[seatId].isBooked} src={seatImgSrc} />
                  </Button>
                  </Tippy2>
                </SeatWrapper>
              );
            })}
            </Seats>
          </Row>
        );
      })}
    </Wrapper>
  );
};

const Tippy2 = styled(Tippy)`
    padding: 5px;
`
const Button = styled.button`
    border: none;
    cursor: pointer;

`

const Seat = styled.img`
  &.true {
    filter: grayscale(100%);
  }
`

const Seats = styled.div`
  display: flex;
  background: #eee;
  padding: 2px 10px;

  &:not(:last-of-type) {
    border-bottom: 3px solid black;
  }
`


const Wrapper = styled.div`
  padding: 8px;

  > .progress {
    margin-left: 50%;
    margin-top: 25%;
    background: #222;
  }
`;

const Row = styled.div`
  display: flex;
  position: relative;

  &:not(:last-of-type) {
    border-bottom: 1px solid #ddd;
  }
`;

const RowLabel = styled.div`
  font-weight: bold;
  margin: 20px;
  width: 70px;
`;

const SeatWrapper = styled.div`
  padding: 5px;

  > .tippy {
    background-color: #222;
    color: black;
    margin-left: 100px;
  }
`;

export default TicketWidget;
