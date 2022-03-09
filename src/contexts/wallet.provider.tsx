import { ethers } from "ethers";
import React, { createContext, useState } from "react";

declare const window: any;

type WalletContextType = {
  address: string;
  shortendAddress: string;
  provider?: ethers.providers.Web3Provider;
  connectMetamask: () => Promise<void>;
};

export const WalletContext = createContext<WalletContextType>({
  address: "",
  shortendAddress: "",
  connectMetamask: async () => {},
});

export function useWalletProvider(): WalletContextType {
  const context = React.useContext(WalletContext);
  return {
    address: context!.address,
    shortendAddress: context.shortendAddress,
    provider: context?.provider,
    connectMetamask: context!.connectMetamask,
  };
}

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>("");
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >(undefined);
  // const userRef = useRef<UserAuth>();
  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          setAddress(accounts[0].toUpperCase());
          const prov = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(prov);
        }
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0].toUpperCase());
          } else setAddress("");
        });
      } catch (error: any) {
        if (error.code === 4001) {
          // User rejected request
        }
        console.log(error);
      }
    }
  };

  const getShortenAddress = (): string => {
    const firstCharacters = address.substring(0, 6);
    const lastCharacters = address.substring(
      address.length - 4,
      address.length
    );
    return `${firstCharacters}...${lastCharacters}`;
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        provider,
        connectMetamask,
        shortendAddress: getShortenAddress(),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
