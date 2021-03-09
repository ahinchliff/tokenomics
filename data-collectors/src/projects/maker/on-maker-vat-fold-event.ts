import { ethers, BigNumber } from "ethers";
import * as moment from "moment";
import { MakerContracts } from "../../../../core-backend/build/smart-contracts/maker";
import { DSNoteEvent } from "./utils/event-utils";

export type VatFoldEvent = DSNoteEvent<
  "fold",
  {
    i: string;
    u: string;
    rate: BigNumber;
  }
>;

const onMakerVatFoldEvent = async (
  event: VatFoldEvent,
  provider: ethers.providers.Provider,
  makerContracts: MakerContracts,
  mysql: data.DataClients,
  postToApi:
    | ((event: data.MakerRevenueFromInterest) => Promise<void>)
    | undefined,
  t: data.IDBTransaction | undefined
) => {
  const { vat } = makerContracts;

  const collateralType = event.args.i;
  const changeInRate = event.args.rate;
  const vatIlkOnPreviousBlock = await vat.ilks(collateralType, {
    blockTag: event.blockNumber - 1,
  });
  const block = await provider.getBlock(event.blockNumber);
  const transaction = await provider.getTransaction(event.transactionHash);

  const revenue = vatIlkOnPreviousBlock.Art.mul(changeInRate);

  const result = await mysql.makerRevenueFromInterest.create(
    {
      blockNumber: event.blockNumber,
      collateralType: ethers.utils.parseBytes32String(collateralType),
      revenue: Number(ethers.utils.formatUnits(revenue, 18 + 27)).toFixed(2),
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

export default onMakerVatFoldEvent;
