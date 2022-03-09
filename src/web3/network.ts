type Network = {
  chainId: string;
  network: string;
  symbol: string;
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
  // logo: string;
  name: string;
  blocksPerYear: number;
  factoryAddress: string;
};

type NetworkData = {
  [key: string]: Network;
};

const NETWORKS: NetworkData = !process.env.REACT_APP_TEST_NETWORK
  ? {
      "0x1": {
        chainId: "0x1",
        network: "Ethereum Mainnet",
        symbol: "ETH",
        // logo: Logos["ETH"],
        name: "Ethereum",
        blocksPerYear: ((24 * 60 * 60) / 13.5) * 365,
        factoryAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
      },
      "0xa4b1": {
        chainId: "0xa4b1",
        network: "Arbitrum One",
        symbol: "AETH",
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
        // logo: Logos["ARBITRUM"],
        name: "AETH",
        blocksPerYear: ((24 * 60 * 60) / 13.5) * 365,
        factoryAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
      },
      "0xfa": {
        chainId: "0xfa",
        network: "Fantom Opera",
        symbol: "FTM",
        rpcUrls: ["https://rpc.ftm.tools/"],
        blockExplorerUrls: ["https://ftmscan.com/"],
        // logo: Logos["FTM"],
        name: "FTM",
        blocksPerYear: 24 * 60 * 60 * 365,
        factoryAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
      },
    }
  : {
      "0x2a": {
        chainId: "0x2a",
        network: "KOVAN Test Network",
        symbol: "ETH",
        rpcUrls: ["https://kovan.infura.io/v3/undefined"],
        blockExplorerUrls: ["https://kovan.etherscan.io"],
        // logo: Logos["ETH"],
        name: "ETH",
        blocksPerYear: 2336000,
        factoryAddress: "0xd513d22422a3062Bd342Ae374b4b9c20E0a9a074",
      },
    };

export { NETWORKS };
export type { Network };
