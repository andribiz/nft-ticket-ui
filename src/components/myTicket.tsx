import { useWalletProvider } from "../contexts/wallet.provider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import {
  searchTicketByAddress,
  TicketFactoryField,
  TicketInfoField,
} from "../web3/lib";
import TicketCard from "./TicketCard";

interface props {
  ticket: TicketFactoryField;
}

const MyTicket: React.FC<props> = ({ ticket }) => {
  const { provider } = useWalletProvider();
  const [ticketNumber, setTicketNumber] = useState<TicketInfoField[]>([]);

  useEffect(() => {
    if (!ticket) return;
    const fetchTickerOwnership = async () => {
      const res = await searchTicketByAddress(
        provider!,
        ticket.address,
        ticket.counter
      );
      setTicketNumber(res);
    };
    fetchTickerOwnership();
  }, [provider, ticket]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>{`Ticket Address: ${ticket?.address}`}</Typography>
      </Grid>
      {ticketNumber.map((val) => (
        <Grid item xs={4}>
          <TicketCard ticketInfo={val} ticketFactoryInfo={ticket} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MyTicket;
