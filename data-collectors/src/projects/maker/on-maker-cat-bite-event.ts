import { MakerContracts } from "core-backend/src/smart-contracts/maker";
import { ethers, BigNumber } from "ethers";
import * as moment from "moment";
import { Event } from "./utils/event-utils";

export type CatBiteEvent = Event<{
  ilk: string;
  urn: string;
  ink: BigNumber;
  art: BigNumber;
  tab: BigNumber;
  flip: string;
  id: BigNumber;
}>;

const onMakerCatBiteEvent = async (
  event: CatBiteEvent,
  provider: ethers.providers.Provider,
  contracts: MakerContracts,
  mysql: data.DataClients,
  _postToApi: ((event: data.MakerRevenueFromPSM) => Promise<void>) | undefined,
  _t: data.IDBTransaction | undefined
) => {
  const block = await provider.getBlock(event.blockNumber);
  const transaction = await provider.getTransaction(event.transactionHash);

  const catIlk = await contracts.cat.ilks(event.args.ilk, {
    blockTag: event.blockNumber,
  });

  await mysql.makerFlipAuction.create({
    makerFlipAuctionId: event.args.id.toNumber(),
    collateralType: ethers.utils.parseBytes32String(event.args.ilk),
    urnAddress: event.args.urn,
    debt: Number(ethers.utils.formatUnits(event.args.tab, 45)).toFixed(2),
    liquidationPenalty: Number(ethers.utils.formatUnits(catIlk.chop, 27)),
    kickBlockNumber: block.number,
    kickTimestamp: moment.utc(moment.unix(Number(block.timestamp))).toDate(),
    kickTransactionHash: transaction.hash,
    kickSender: transaction.from,
  });
};

export default onMakerCatBiteEvent;
