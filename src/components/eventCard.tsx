import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { EventField, getEventAddress, getEventDetails } from "../web3/lib";
import { useWalletProvider } from "../contexts/wallet.provider";
import { Link } from "react-router-dom";

interface props {
  index: number;
}

const EventCard: React.FC<props> = ({ index }) => {
  const [eventAddress, setEventAddress] = useState<string>("");
  const [event, setEvent] = useState<EventField>();
  const { provider } = useWalletProvider();

  useEffect(() => {
    if (!eventAddress) return;
    const fetchDetail = async () => {
      const res = await getEventDetails(provider!, eventAddress);
      setEvent(res);
    };
    fetchDetail();
  }, [provider, eventAddress]);

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getEventAddress(provider!, index);
      setEventAddress(address);
    };
    fetchAddress();
  }, [provider, index]);

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {eventAddress}
        </Typography>
        <Typography variant="h5" component="div">
          {event?.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {event?.symbol}
        </Typography>
        <Typography variant="body2">{event?.description}</Typography>
      </CardContent>
      <CardActions>
        {eventAddress && (
          <Link to={`/event/${eventAddress}`}>
            <Button size="small">Let me in</Button>
          </Link>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;
