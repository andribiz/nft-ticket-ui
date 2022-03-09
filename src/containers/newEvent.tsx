import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useWalletProvider } from "../contexts/wallet.provider";
import { EventField, createEvent } from "../web3/lib";

const NewEvent: React.FC = () => {
  const [event, setEvent] = useState<EventField>({
    name: "",
    symbol: "",
    description: "",
  });
  const { provider } = useWalletProvider();

  const handleCreate = async (): Promise<void> => {
    if (!provider) {
      console.log("Please connect with your metamask");
      return;
    }
    try {
      const receipt = await createEvent(provider!, event);
      console.log("Success: ", receipt);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h3">New Event</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            label="Name Event"
            variant="filled"
            onChange={(e) => {
              setEvent({ ...event, name: e.target.value });
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            label="Symbol of Event"
            variant="filled"
            onChange={(e) => {
              setEvent({ ...event, symbol: e.target.value });
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            rows={3}
            label="Description"
            multiline
            variant="filled"
            onChange={(e) => {
              setEvent({ ...event, description: e.target.value });
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <Button
            variant="contained"
            onClick={() => {
              handleCreate();
            }}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewEvent;
