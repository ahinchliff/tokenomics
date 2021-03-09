import { ethers } from "ethers";
import Api from "../../../../core-backend/build/clients/api-client";
import {
  fetchEvents,
  fetchDSNoteEvents,
  onDSNoteEvent,
  onEvent,
  fetchAndProcessPastEvents,
  getMethodTopics,
  parseDSNoteEvent,
} from "./utils/event-utils";
import getMakerContracts from "../../../../core-backend/build/smart-contracts/maker";
import onMakerVatFoldEvent, { VatFoldEvent } from "./on-maker-vat-fold-event";
import onMakerPSMEvent, { PSMEvent } from "./on-maker-psm-event";
import onMakerCatBiteEvent, { CatBiteEvent } from "./on-maker-cat-bite-event";
import { flipABI } from "../../../../core-backend/src/smart-contracts/maker/abi";
import onMakerFlipTendEvent, {
  FlipTendEvent,
} from "./on-maker-flip-tend-event";

export const makerListen = async (
  provider: ethers.providers.Provider,
  mysql: data.DataClients,
  api: Api,
  config: config.Config
): Promise<void> => {
  const mc = getMakerContracts(provider);

  onDSNoteEvent(mc.vat, ["fold"], async (event: VatFoldEvent) => {
    console.log("VAT fold event received");
    onMakerVatFoldEvent(
      event,
      provider,
      mc,
      mysql,
      async (e: data.MakerRevenueFromInterest) => {
        await api.post(config.newEventEndpoint.url, {
          password: config.newEventEndpoint.password,
          event: {
            event: "interestRevenue",
            data: e,
          },
        });
      },
      undefined
    );
  });

  onEvent(mc.psmUSDC, [], async (event: PSMEvent) => {
    console.log("PSM event received");
    onMakerPSMEvent(
      event,
      provider,
      mysql,
      async (e: data.MakerRevenueFromPSM) => {
        await api.post(config.newEventEndpoint.url, {
          password: config.newEventEndpoint.password,
          event: {
            event: "tradeRevenue",
            data: e,
          },
        });
      },
      undefined
    );
  });

  console.log("Listening for events!");
};

export const fetchAndProcessPastPSMEvents = async (
  fromBlock: number,
  toAndIncludingBlock: number,
  numberOfBlocksToScanAtATime: number,
  provider: ethers.providers.Provider,
  mysql: data.DataClients,
  _api: Api
) => {
  const mc = getMakerContracts(provider);

  const fetchPSMEvents = (_fromBlock: number, _toBlock: number) =>
    fetchEvents<PSMEvent>(
      mc.psmUSDC,
      [ethers.utils.id("SellGem(address,uint256,uint256)")],
      _fromBlock,
      _toBlock
    );

  const processEvent = (event: PSMEvent, t: data.IDBTransaction) =>
    onMakerPSMEvent(event, provider, mysql, undefined, t);

  await fetchAndProcessPastEvents(
    fetchPSMEvents,
    processEvent,
    fromBlock,
    toAndIncludingBlock,
    numberOfBlocksToScanAtATime,
    mysql.dbTransaction
  );
};

export const fetchAndProcessPastVatFoldEvents = async (
  fromBlock: number,
  toAndIncludingBlock: number,
  numberOfBlocksToScanAtATime: number,
  provider: ethers.providers.Provider,
  mysql: data.DataClients
) => {
  const mc = getMakerContracts(provider);

  const fetchEvents = (_fromBlock: number, _toBlock: number) =>
    fetchDSNoteEvents<VatFoldEvent>(mc.vat, ["fold"], _fromBlock, _toBlock);

  const processEvent = (event: VatFoldEvent, t: data.IDBTransaction) =>
    onMakerVatFoldEvent(event, provider, mc, mysql, undefined, t);

  await fetchAndProcessPastEvents(
    fetchEvents,
    processEvent,
    fromBlock,
    toAndIncludingBlock,
    numberOfBlocksToScanAtATime,
    mysql.dbTransaction
  );
};

export const fetchAndProcessPastCatBiteEvents = async (
  fromBlock: number,
  toAndIncludingBlock: number,
  numberOfBlocksToScanAtATime: number,
  provider: ethers.providers.Provider,
  mysql: data.DataClients,
  _api: Api
) => {
  const mc = getMakerContracts(provider);

  const fetchPSMEvents = (_fromBlock: number, _toBlock: number) =>
    fetchEvents<CatBiteEvent>(
      mc.cat,
      [
        ethers.utils.id(
          "Bite(bytes32,address,uint256,uint256,uint256,address,uint256)"
        ),
      ],
      _fromBlock,
      _toBlock
    );

  const processEvent = (event: CatBiteEvent, t: data.IDBTransaction) =>
    onMakerCatBiteEvent(event, provider, mc, mysql, undefined, t);

  await fetchAndProcessPastEvents(
    fetchPSMEvents,
    processEvent,
    fromBlock,
    toAndIncludingBlock,
    numberOfBlocksToScanAtATime,
    mysql.dbTransaction
  );
};

export const fetchAndProcessPastFlipTendEvents = async (
  fromBlock: number,
  toAndIncludingBlock: number,
  numberOfBlocksToScanAtATime: number,
  provider: ethers.providers.Provider,
  mysql: data.DataClients,
  _api: Api
) => {
  const flipInterface = new ethers.utils.Interface(flipABI);

  const topic = getMethodTopics(flipInterface, "tend");

  const fetchEvents = async (
    _fromBlock: number,
    _toBlock: number
  ): Promise<FlipTendEvent[]> => {
    const events = await provider.getLogs({
      topics: [topic],
      fromBlock: _fromBlock,
      toBlock: _toBlock,
    });

    console.log("events", "-------");

    return events.map((e: any) => parseDSNoteEvent(flipInterface, e));
  };

  const mc = getMakerContracts(provider);

  const processEvent = (event: FlipTendEvent, t: data.IDBTransaction) =>
    onMakerFlipTendEvent(event, provider, mc, mysql, undefined, t);

  await fetchAndProcessPastEvents(
    fetchEvents,
    processEvent,
    fromBlock,
    toAndIncludingBlock,
    numberOfBlocksToScanAtATime,
    mysql.dbTransaction
  );
};
