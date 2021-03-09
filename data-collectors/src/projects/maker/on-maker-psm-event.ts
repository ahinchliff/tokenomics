import { ethers, BigNumber } from "ethers";
import * as moment from "moment";
import { Event } from "./utils/event-utils";

export type PSMEvent = Event<{
  address: string;
  value: BigNumber;
  fee: BigNumber;
}>;

const onPSMEvent = async (
  event: PSMEvent,
  provider: ethers.providers.Provider,
  mysql: data.DataClients,
  postToApi: ((event: data.MakerRevenueFromPSM) => Promise<void>) | undefined,
  t: data.IDBTransaction | undefined
) => {
  const block = await provider.getBlock(event.blockNumber);
  const transaction = await provider.getTransaction(event.transactionHash);

  if (event.event !== "SellGem" && event.event !== "BuyGem") {
    throw Error(`Not recognised event - ${event.event}`);
  }

  const result = await mysql.makerRevenueFromPSM.create(
    {
      blockNumber: event.blockNumber,
      action: event.event === "BuyGem" ? "buy" : "sell",
      gem: "USDC",
      gemAmount: Number(ethers.utils.formatUnits(event.args.value, 6)).toFixed(
        2
      ),
      revenue: Number(ethers.utils.formatUnits(event.args.fee, 18)).toFixed(2),
      transactionHash: event.transactionHash,
      sender: transaction.from,
      timestamp: moment.utc(moment.unix(Number(block.timestamp))).toDate(),
    },
    t
  );

  if (postToApi) {
    try {
      await postToApi(result);
    } catch (e) {
      console.log(e);
    }
  }
};

export default onPSMEvent;
