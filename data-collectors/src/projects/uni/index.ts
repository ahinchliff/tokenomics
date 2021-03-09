import { ethers } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import * as moment from "moment";

const uniClient = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
);

const blockClient = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks"
);

const uni = async (block: ethers.providers.Block) => {
  const blockNumber72HoursAgo = await getBlockXHoursAgo(72);

  const totalVolume = await getTotalVolumeAtBlock(block.number - 10);

  const totalVolumeUpTo72HoursAgo = await getTotalVolumeAtBlock(
    Number(blockNumber72HoursAgo.number)
  );

  const volumeInLast72Hours = totalVolume - totalVolumeUpTo72HoursAgo;

  const projectedVolumeForYear = (volumeInLast72Hours / 3) * 365;

  return {
    projectedYearlyRevenue: 0,
    projectedYearRevenueIfFeesOn: projectedVolumeForYear * 0.0005,
  };
};

export default uni;

const getTotalVolumeAtBlock = async (blockNumber?: number): Promise<number> => {
  const query = gql`
    query blocks($blockNumber: Int!) {
      uniswapFactory(
        id: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
        block: { number: $blockNumber }
      ) {
        totalVolumeUSD
      }
    }
  `;
  return Number(
    (await uniClient.request(query, { blockNumber })).uniswapFactory
      .totalVolumeUSD
  );
};

const getBlockXHoursAgo = async (
  hoursAgo: number
): Promise<{
  id: string;
  number: string;
  timestamp: string;
}> => {
  const utcCurrentTime = moment.utc();
  const utcOneDayBack = utcCurrentTime
    .subtract(hoursAgo, "hour")
    .startOf("minute")
    .unix();
  const query = gql`
    query blocks($timestampFrom: Int!, $timestampTo: Int!) {
      blocks(
        first: 1
        orderBy: timestamp
        orderDirection: asc
        where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
      ) {
        id
        number
        timestamp
      }
    }
  `;

  const result = await blockClient.request(query, {
    timestampFrom: utcOneDayBack,
    timestampTo: utcOneDayBack + 600,
  });

  return result.blocks[0];
};
