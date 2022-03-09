import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TicketFactoryField, TicketInfoField } from "../web3/lib";

interface props {
  ticketInfo: TicketInfoField;
  ticketFactoryInfo: TicketFactoryField;
}

const TicketCard: React.FC<props> = ({ ticketInfo, ticketFactoryInfo }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {ticketFactoryInfo.symbol}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {ticketFactoryInfo.name}
        </Typography>
        <Typography variant="h5" component="div">
          {`#${ticketInfo.ticketNumber}`}
        </Typography>
        <Typography variant="h5" component="div">
          {ticketInfo.attended ? "Attended" : "Valid"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
