import { ethers, BigNumber } from "ethers";

export type Event<Args> = Omit<ethers.Event, "args"> & { args: Args };

export type DSNoteEvent<Method extends string, Args> = {
  contractAddress: string;
  blockNumber: number;
  method: Method;
  value: BigNumber;
  args: Args;
  transactionHash: string;
  from: string;
};

export const fetchEvents = async <E>(
  contract: ethers.Contract,
  events: string[],
  fromBlock: number,
  toBlock: number
): Promise<E[]> => {
  return (contract.queryFilter(
    {
      topics: events,
    },
    fromBlock,
    toBlock
  ) as unknown) as E[];
};

export const fetchDSNoteEvents = async <Event>(
  contract: ethers.Contract,
  methods: string[],
  fromBlock: number,
  toBlock: number
) => {
  const methodTopics = methods.map((method) =>
    getMethodTopics(contract.interface, method)
  );

  const rawEvents = await contract.queryFilter(
    {
      topics: [methodTopics],
    },
    fromBlock,
    toBlock
  );

  return rawEvents.map((event) =>
    parseDSNoteEvent<Event>(contract.interface, event)
  );
};

export const onEvent = <Event>(
  contract: ethers.Contract,
  topics: string[],
  cb: (event: Event) => void
) => {
  contract.on(
    {
      topics,
    },
    (...args) => {
      const event = args[args.length - 1];
      cb(event);
    }
  );
};

export const onDSNoteEvent = <Event>(
  contract: ethers.Contract,
  methods: string[],
  cb: (event: Event) => void
) => {
  const methodTopics = methods.map((method) =>
    getMethodTopics(contract.interface, method)
  );

  contract.on(
    {
      topics: [methodTopics],
    },
    (...args) => {
      const e = args[args.length - 1];
      const note = parseDSNoteEvent<Event>(contract.interface, e);
      console.log(`Event received for ${(note as any).method}`);
      cb(note);
    }
  );
};

export const getMethodTopics = (
  i: ethers.utils.Interface,
  methodName: string
) =>
  i.getSighash(i.getFunction(methodName)) +
  "00000000000000000000000000000000000000000000000000000000";

export const parseDSNoteEvent = <Event>(
  i: ethers.utils.Interface,
  event: ethers.Event
): Event => {
  const logNoteABI = [
    {
      inputs: [
        { indexed: true, name: "sig", type: "bytes4" },
        { indexed: true, name: "arg1", type: "bytes32" },
        { indexed: true, name: "arg2", type: "bytes32" },
        { indexed: true, name: "arg3", type: "bytes32" },
        { indexed: false, name: "data", type: "bytes" },
      ],
      name: "LogNote",
      type: "event",
    },
  ];

  console.log(event);

  const logNoteInterface = new ethers.utils.Interface(logNoteABI);

  const logNote = logNoteInterface.parseLog({
    data: event.data,
    topics: [logNoteInterface.getEventTopic("LogNote"), ...event.topics],
  });

  const decodedCallData = i.parseTransaction({
    data: logNote.args.data,
  });

  return ({
    contractAddress: event.address,
    blockNumber: event.blockNumber,
    method: decodedCallData.name,
    value: decodedCallData.value,
    args: decodedCallData.args,
    transactionHash: event.transactionHash,
    from: logNote.args.guy,
  } as unknown) as Event;
};

export const fetchAndProcessPastEvents = async <T>(
  fetchEvents: (fromBlock: number, toBlock: number) => Promise<T[]>,
  processEvent: (event: T, transaction: data.IDBTransaction) => Promise<void>,
  fromBlock: number,
  toAndIncludingBlock: number,
  numberOfBlocksToScanAtATime: number,
  transactions: data.IDBTransactionClient
): Promise<void> => {
  const totalBlocks = toAndIncludingBlock - fromBlock + 1;
  let currentFrom = fromBlock;

  while (currentFrom <= toAndIncludingBlock) {
    let failureCount = 0;
    const currentTo =
      currentFrom + numberOfBlocksToScanAtATime > toAndIncludingBlock
        ? toAndIncludingBlock
        : currentFrom + numberOfBlocksToScanAtATime;

    const retry = async () => {
      try {
        await fetchAndProcessBlockOfEvents(
          fetchEvents,
          processEvent,
          currentFrom,
          currentTo,
          fromBlock,
          totalBlocks,
          transactions
        );
        failureCount = 0;
      } catch (e) {
        console.log(e);
        failureCount = failureCount + 1;
        if (failureCount < 3) {
          console.log("Batch failed. Retrying...");
          await retry();
        }
        return;
      }
    };

    await retry();

    if (failureCount > 0) {
      logWithTimeout("Batch failed three times. Quiting.");
      break;
    }

    currentFrom = currentFrom + numberOfBlocksToScanAtATime + 1;
  }

  logWithTimeout("Finished");
};

const fetchAndProcessBlockOfEvents = async <T>(
  fetchEvents: (fromBlock: number, toBlock: number) => Promise<T[]>,
  processEvent: (event: T, transaction: data.IDBTransaction) => Promise<void>,
  currentFrom: number,
  currentTo: number,
  totalFrom: number,
  totalBlocks: number,
  transactions: data.IDBTransactionClient
) => {
  await transactions.create(async (t) => {
    console.log(
      `Fetching events from ${currentFrom} - ${currentTo} [${(
        ((currentFrom - totalFrom) / totalBlocks) *
        100
      ).toFixed(2)}%]`
    );

    const events = await fetchEvents(currentFrom, currentTo);

    const chuckedEvents = chunkArray(events, 10);

    for (const eventChunks of chuckedEvents) {
      const promises = [];
      for (const event of eventChunks) {
        promises.push(processEvent(event, t));
      }
      await Promise.all(promises);
    }
  });
};

const chunkArray = <T>(inputArray: T[], perChunk: number) =>
  inputArray.reduce((resultArray: T[][], item: T, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, ([] as unknown) as T[][]);

const logWithTimeout = (message: string) => {
  setTimeout(() => console.log(message), 5000);
};
