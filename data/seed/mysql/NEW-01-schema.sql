CREATE DATABASE `tokenomics`;
ALTER DATABASE `tokenomics` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `tokenomics`;

-- CREATE TABLE IF NOT EXISTS `makerFlapAuction` (
--   `makerFlapAuction_makerFlapAuctionId` INT NOT NULL,
--   `makerFlapAuction_lot` INT NOT NULL,
--   `makerFlapAuction_kickBlockNumber` INT NOT NULL,
--   `makerFlapAuction_kickTimestamp` timestamp NULL,
--   `makerFlapAuction_kickSenderAddress` VARCHAR(42) NOT NULL,
--   `makerFlapAuction_kickTransactionHash` VARCHAR(66) NULL,
--   `makerFlapAuction_kickGasUsed` INT NOT NULL,
--   `makerFlapAuction_kickGasPrice` BIGINT NOT NULL,
--   `makerFlapAuction_kickEthPrice` FLOAT NOT NULL,
--   `makerFlapAuction_kickEthPriceAccuracy` ENUM ('minute', 'hour', 'day') NOT NULL,
--   `makerFlapAuction_dealBlockNumber` INT NULL,
--   `makerFlapAuction_dealTimestamp` timestamp NULL,
--   `makerFlapAuction_dealSenderAddress` VARCHAR(42) NULL,
--   `makerFlapAuction_dealTransactionHash` VARCHAR(66) NULL,
--   `makerFlapAuction_dealGasUsed` INT NULL,
--   `makerFlapAuction_dealGasPrice` BIGINT NULL,
--   `makerFlapAuction_dealEthPrice` FLOAT NULL,
--   `makerFlapAuction_dealEthPriceAccuracy` ENUM ('minute', 'hour', 'day') NULL,
--   `makerFlapAuction_mkrPriceWhenAuctionEnded` FLOAT NULL,
--   `makerFlapAuction_mkrPriceWhenAuctionEndedAccuracy` ENUM ('minute', 'hour', 'day') NULL,
--   `makerFlapAuction_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `makerFlapAuction_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`makerFlapAuction_makerFlapAuctionId`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- CREATE TABLE IF NOT EXISTS `makerFlapAuctionBid` (
--   `makerFlapAuctionBid_makerFlapAuctionBidId` SERIAL,
--   `makerFlapAuctionBid_makerFlapAuctionId` INT NOT NULL,
--   `makerFlapAuctionBid_bid` DECIMAL(30, 18) NOT NULL,
--   `makerFlapAuctionBid_ttl` INT NOT NULL,
--   `makerFlapAuctionBid_blockNumber` INT NOT NULL,
--   `makerFlapAuctionBid_timestamp` timestamp NOT NULL,
--   `makerFlapAuctionBid_senderAddress` VARCHAR(42) NOT NULL,
--   `makerFlapAuctionBid_transactionHash` VARCHAR(66) NOT NULL,
--   `makerFlapAuctionBid_gasUsed` INT NOT NULL,
--   `makerFlapAuctionBid_dealGasPrice` BIGINT NULL,
--   `makerFlapAuctionBid_ethPrice` FLOAT NOT NULL,
--   `makerFlapAuctionBid_ethPriceAccuracy` ENUM ('minute', 'hour', 'day') NOT NULL,
--   `makerFlapAuctionBid_mkrPrice` FLOAT NOT NULL,
--   `makerFlapAuctionBid_mkrPriceAccuracy` ENUM ('minute', 'hour', 'day') NOT NULL,
--   `makerFlapAuctionBid_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `makerFlapAuctionBid_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`makerFlapAuctionBid_makerFlapAuctionBidId`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `makerRevenueFromInterest` (
  `makerRevenueFromInterest_makerRevenueFromInterestId` SERIAL,
  `makerRevenueFromInterest_blockNumber` INT NOT NULL,
  `makerRevenueFromInterest_timestamp` timestamp NOT NULL,
  `makerRevenueFromInterest_collateralType` VARCHAR(30) NOT NULL,
  `makerRevenueFromInterest_revenue` DECIMAL(10, 2),
  `makerRevenueFromInterest_transactionHash` VARCHAR(66) NOT NULL,
  `makerRevenueFromInterest_sender` VARCHAR(42) NOT NULL,
  `makerRevenueFromInterest_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `makerRevenueFromInterest_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`makerRevenueFromInterest_makerRevenueFromInterestId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `makerRevenueFromPSM` (
  `makerRevenueFromPSM_makerRevenueFromPSMId` SERIAL,
  `makerRevenueFromPSM_blockNumber` INT NOT NULL,
  `makerRevenueFromPSM_timestamp` timestamp NOT NULL,
  `makerRevenueFromPSM_action` ENUM ('buy', 'sell'),
  `makerRevenueFromPSM_gem` VARCHAR(30) NOT NULL,
  `makerRevenueFromPSM_gemAmount` DECIMAL(14, 2),
  `makerRevenueFromPSM_revenue` DECIMAL(14, 2),
  `makerRevenueFromPSM_transactionHash` VARCHAR(66) NOT NULL,
  `makerRevenueFromPSM_sender` VARCHAR(42) NOT NULL,
  `makerRevenueFromPSM_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `makerRevenueFromPSM_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`makerRevenueFromPSM_makerRevenueFromPSMId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `makerFlipAuction` (
  `makerFlipAuction_makerFlipAuctionId` INT NOT NULL,
  `makerFlipAuction_collateralType` VARCHAR(30) NOT NULL,
  `makerFlipAuction_urnAddress` VARCHAR(42) NOT NULL,
  `makerFlipAuction_debt` DECIMAL(14, 2) NOT NULL,
  `makerFlipAuction_liquidationPenalty` DECIMAL(4, 2) NOT NULL,
  `makerFlipAuction_kickBlockNumber` INT NOT NULL,
  `makerFlipAuction_kickTimestamp` timestamp NOT NULL,
  `makerFlipAuction_kickTransactionHash` VARCHAR(66) NOT NULL,
  `makerFlipAuction_kickSender` VARCHAR(42) NOT NULL,
  `makerFlipAuction_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `makerFlipAuction_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`makerFlipAuction_makerFlipAuctionId`, `makerFlipAuction_collateralType`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `makerFlipAuctionBid` (
  `makerFlipAuctionBid_makerFlipAuctionBidId` SERIAL,
  `makerFlipAuctionBid_makerFlipAuctionId` INT NOT NULL,
  `makerFlipAuctionBid_bid` DECIMAL(30, 18) NOT NULL,
  `makerFlipAuctionBid_ttl` INT NOT NULL,
  `makerFlipAuctionBid_blockNumber` INT NOT NULL,
  `makerFlipAuctionBid_timestamp` timestamp NOT NULL,
  `makerFlipAuctionBid_sender` VARCHAR(42) NOT NULL,
  `makerFlipAuctionBid_transactionHash` VARCHAR(66) NOT NULL,
  `makerFlipAuctionBid_createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `makerFlipAuctionBid_updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`makerFlipAuctionBid_makerFlipAuctionBidId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


