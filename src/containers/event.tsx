import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import {
  TicketFactoryField,
  EventField,
  getEventDetails,
  changeEventPrice,
  getTicketDetails,
  usdcIsApproved,
  usdcApprove,
  eventBuyTicket,
  getEventBalance,
} from "../web3/lib";
import { useWalletProvider } from "../contexts/wallet.provider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MyTicket from "../components/myTicket";

const Event: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventField>();
  const [ticket, setTicket] = useState<TicketFactoryField>();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { provider, address } = useWalletProvider();

  const handleChangePrice = async (): Promise<void> => {
    if (!provider) {
      console.log("Please connect with your metamask");
      return;
    }
    try {
      const receipt = await changeEventPrice(provider!, id!, event!.price!);
      console.log("Success: ", receipt);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuy = async () => {
    try {
      const receipt = await eventBuyTicket(provider!, id!, 1);
      console.log("Success: ", receipt);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIsApproved = async () => {
    try {
      const approved = await usdcIsApproved(provider!);
      setIsApproved(approved);
    } catch (e) {
      console.log(e);
    }
  };

  const handleApprove = async () => {
    try {
      const reciept = await usdcApprove(provider!);
      console.log(reciept);
      setIsApproved(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!event || !provider) return;

    const fetchDetail = async () => {
      const res = await getTicketDetails(provider!, event!.addressTicket!);

      setTicket(res);
    };
    fetchDetail();
  }, [provider, event]);

  useEffect(() => {
    if (!provider) return;
    const fetchDetail = async () => {
      const res = await getEventDetails(provider!, id!);
      res.balance = await getEventBalance(provider!, id!);
      setEvent(res);
    };
    fetchDetail();
    checkIsApproved();
  }, [provider, id]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography>{`Event: ${id}`}</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{`Name: ${event?.name}`}</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{`Desc: ${event?.description}`}</Typography>
        </Grid>
        <Grid item xs={8}>
          {address === event?.organizer?.toUpperCase() ? (
            <TextField
              label="Price"
              variant="filled"
              type="number"
              value={event?.price}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setEvent({ ...event, price: parseFloat(e.target.value) });
              }}
            />
          ) : (
            <Typography>{`Price: ${event?.price}`}</Typography>
          )}
        </Grid>
        {ticket && (
          <Grid item xs={8}>
            <Typography>{`Terjual: ${ticket?.counter}`}</Typography>
          </Grid>
        )}
        {address !== event?.organizer?.toUpperCase() && (
          <Grid item xs={8}>
            <Typography>{`Organizer: ${event?.organizer}`}</Typography>
          </Grid>
        )}
        <Grid item xs={8}>
          {isApproved ? (
            <Button onClick={handleBuy} variant="contained">
              Buy with USDC
            </Button>
          ) : (
            <Button onClick={handleApprove} variant="contained">
              Approve USDC
            </Button>
          )}
        </Grid>
        {address === event?.organizer?.toUpperCase() && (
          <>
            <Grid item xs={8}>
              <Typography>{`Balance: ${event?.balance} USDC`}</Typography>
            </Grid>

            <Grid item xs={8}>
              <Button variant="contained" onClick={handleChangePrice}>
                Change price
              </Button>
              <Button variant="contained" onClick={handleChangePrice}>
                Withdrawal
              </Button>
            </Grid>
          </>
        )}
        {event?.addressTicket && (
          <Grid item xs={8}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>My Tickets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MyTicket ticket={ticket!} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Event;
