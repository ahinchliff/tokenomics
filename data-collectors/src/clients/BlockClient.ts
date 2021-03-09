import { GraphQLClient, gql } from "graphql-request";
import * as moment from "moment";

export default class BlockClient {
  private gqlClient: GraphQLClient;

  constructor(endpoint: string) {
    this.gqlClient = new GraphQLClient(endpoint);
  }

  public getBlock = async (
    blockNumber: number
  ): Promise<{ timestamp: string }> => {
    const query = gql`
      query blocks($blockNumber: Int!) {
        blocks(where: { number: $blockNumber }) {
          timestamp
        }
      }
    `;

    const result = await this.gqlClient.request(query, {
      blockNumber,
    });

    return result.blocks[0];
  };

  public getBlockXHoursAgo = async (
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

    const result = await this.gqlClient.request(query, {
      timestampFrom: utcOneDayBack,
      timestampTo: utcOneDayBack + 600,
    });

    return result.blocks[0];
  };
}
