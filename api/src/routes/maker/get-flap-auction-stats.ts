import { RequestHandler } from "../handlerBuilders";

const getFlapAuctionStats: RequestHandler<
  {},
  {},
  {},
  api.MakerFlapAuctionStats
> = async ({ services }) => {
  const numberOfAuctions = await services.mysql.makerFlapAuction.numberOfAuctions();
  const numberOfAuctionsWhereKickerIsWinner = await services.mysql.makerFlapAuction.numberOfAuctionsWhereKickerIsWinner();
  const leaderBoard = await services.mysql.makerFlapAuction.leaderBoard();
  const totalDaiAuctioned = await services.mysql.makerFlapAuction.totalDaiAuctioned();
  const totalMakerBurned = await services.mysql.makerFlapAuction.totalMakerBurned();
  const numberOfBidsFrequency = await services.mysql.makerFlapAuction.numberOfBidsFrequency();
  const auctionCountByMonth = await services.mysql.makerFlapAuction.auctionCountByMonth();
  const uniqueBidders = await services.mysql.makerFlapAuction.uniqueBidders();
  const withdrawTimesAfterWinning = await services.mysql.makerFlapAuction.withdrawTimesAfterWinning();

  const result: api.MakerFlapAuctionStats = {
    numberOfAuctions,
    numberOfAuctionsWhereKickerIsWinner,
    totalDaiAuctioned,
    totalMakerBurned,
    uniqueBidders,
    auctionCountByMonth,
    withdrawTimesAfterWinning,
    numberOfBidsFrequency,
    leaderBoard,
  };

  return result;
};

export default getFlapAuctionStats;
