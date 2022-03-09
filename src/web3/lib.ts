import { ethers, BigNumber } from "ethers";
import EVENT_FACTORY_ABI from "./abi/EventsFactory";
import EVENT_ABI from "./abi/Event";
import TICKET_ABI from "./abi/Ticket";
import TOKEN_ABI from "./abi/Token";

export interface EventField {
  name: string;
  symbol?: string;
  description: string;
  organizer?: string;
  addressTicket?: string;
  price?: number;
  balance?: number;
}

export interface TicketFactoryField {
  address: string;
  counter: number;
  ticketURI: string;
  ticketOwner: string;
  symbol: string;
  name: string;
}

export interface TicketInfoField {
  ticketNumber: number;
  owner: number;
  attended: boolean;
}

export const createEvent = async (
  provider: ethers.providers.Web3Provider,
  event: EventField
): Promise<any> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS!,
    EVENT_FACTORY_ABI,
    signer
  );
  const tx = await contract.createEvent(
    event.name,
    event.description,
    event.symbol,
    "",
    [process.env.REACT_APP_USDC_ADDRESS]
  );
  return await tx.wait();
};

export const getEventDetails = async (
  provider: ethers.providers.Web3Provider,
  eventAddress: string
): Promise<EventField> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(eventAddress, EVENT_ABI, signer);
  const [name, description, addressTicket, organizer, priceBN] =
    await Promise.all([
      await contract.name(),
      await contract.description(),
      await contract.ticket(),
      await contract.organizer(),
      await contract.price(),
    ]);

  const price = parseFloat(ethers.utils.formatEther(priceBN));
  return {
    name,
    description,
    organizer,
    addressTicket,
    price,
  };
};

export const getTicketDetails = async (
  provider: ethers.providers.Web3Provider,
  ticketAddress: string
): Promise<TicketFactoryField> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ticketAddress, TICKET_ABI, signer);
  const [counter, name, symbol, ticketOwner] = await Promise.all([
    await contract.counter(),
    await contract.name(),
    await contract.symbol(),
    await contract.ticketOwner(),
  ]);

  return {
    address: ticketAddress,
    counter,
    name,
    symbol,
    ticketURI: "",
    ticketOwner,
  };
};

export const searchTicketByAddress = async (
  provider: ethers.providers.Web3Provider,
  ticketAddress: string,
  length: number
): Promise<TicketInfoField[]> => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const contract = new ethers.Contract(ticketAddress, TICKET_ABI, signer);
  const countBN = await contract.balanceOf(address);
  const count = parseFloat(countBN.toString());
  const val: TicketInfoField[] = [];

  for (let i = 0; i < length; i++) {
    if (val.length >= count) break;
    const owner = await contract.ownerOf(i + 1);
    if (owner === address) {
      const attended = await contract.isAttended(i + 1);
      val.push({
        ticketNumber: i+1,
        owner, 
        attended
      });
    }
  }
  return val;
};

export const getEventAddress = async (
  provider: ethers.providers.Web3Provider,
  index: number
): Promise<string> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS!,
    EVENT_FACTORY_ABI,
    signer
  );
  const address: string = await contract.allEvents(index);

  return address;
};

export const getEventBalance = async (
  provider: ethers.providers.Web3Provider,
  eventAddress: string
): Promise<number> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS!,
    EVENT_FACTORY_ABI,
    signer
  );
  const amountBN: BigNumber = await contract.balances(
    eventAddress,
    process.env.REACT_APP_USDC_ADDRESS!
  );

  const amount = parseFloat(ethers.utils.formatEther(amountBN));

  return amount;
};

export const lengthEvents = async (
  provider: ethers.providers.Web3Provider
): Promise<number> => {
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS!,
    EVENT_FACTORY_ABI,
    signer
  );
  const count: BigNumber = await contract.allEventsLength();
  return count.toNumber();
};

export const changeEventPrice = async (
  provider: ethers.providers.Web3Provider,
  eventAddress: string,
  price: number
): Promise<any> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(eventAddress, EVENT_ABI, signer);
  const amount = ethers.utils.parseUnits(price.toString(), 18);

  const tx = await contract.setPrice(amount);

  return tx.wait();
};

export const eventBuyTicket = async (
  provider: ethers.providers.Web3Provider,
  eventAddress: string,
  qty: number
): Promise<any> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(eventAddress, EVENT_ABI, signer);
  const tx = await contract.buy(
    await signer.getAddress(),
    process.env.REACT_APP_USDC_ADDRESS!,
    BigNumber.from(qty.toString())
  );

  return tx.wait();
};

export const usdcIsApproved = async (
  provider: ethers.providers.Web3Provider
): Promise<boolean> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_USDC_ADDRESS!,
    TOKEN_ABI,
    signer
  );
  const amount: BigNumber = await contract.allowance(
    await signer.getAddress(),
    process.env.REACT_APP_CONTRACT_ADDRESS
  );

  return amount.gt(BigNumber.from("1000000000"));
};

export const usdcApprove = async (
  provider: ethers.providers.Web3Provider
): Promise<any> => {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_USDC_ADDRESS!,
    TOKEN_ABI,
    signer
  );

  const approveTx = await contract.approve(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    ethers.constants.MaxUint256
  );
  return approveTx.wait();
};
