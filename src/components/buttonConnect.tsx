import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { useWalletProvider } from "../contexts/wallet.provider";

const ButtonConnect = () => {
  const { address, shortendAddress, connectMetamask } = useWalletProvider();
  return (
    <Button color="inherit" onClick={connectMetamask}>
      {address === "" ? "Connect with Metamask" : shortendAddress}
    </Button>
  );
};

export default ButtonConnect;
