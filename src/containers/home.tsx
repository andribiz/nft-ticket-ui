import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { lengthEvents } from "../web3/lib";
import { useWalletProvider } from "../contexts/wallet.provider";
import EventCard from "../components/eventCard";

const Content: React.FC = () => {
  const [eventLength, setEventLength] = useState<number>(0);

  const { provider } = useWalletProvider();

  useEffect(() => {
    if (!provider) {
      return;
    }

    const fetchLengthEvents = async () => {
      const count = await lengthEvents(provider!);
      setEventLength(count);
    };

    fetchLengthEvents();
  }, [provider]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography>Welcome to Event</Typography>
        </Grid>
        <Grid item xs={4}>
          <Link to="/newevent">
            <Button variant="contained">Create Event</Button>
          </Link>
        </Grid>
        {Array.from(Array(eventLength).keys()).map((val) => (
          <Grid key={val} item md={4} xs={6}>
            <EventCard index={val} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Content;
