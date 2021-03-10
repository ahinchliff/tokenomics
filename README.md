# Tokenomics

**One of my many messy projects created to explore Ethereum development.**

A fullstack TypeScript project to visualise on-chain MakerDAO data.

## Things of may be of interest

- Typed wrappers around the MakerDAO contracts. See `core-backend/src/smart-contracts/index`.
- The utils I created for fetching past events. See `data-collectors/src/maker/utils`.

## Components

### Data Collections

A simple node script that listens for Ethereum events related to MakerDAO using Ethers. The same logic can be used to listen for upcoming events and processing past events. For all events data is saved to a SQL DB and for a new events an endpoint of the api is called to provide realtime updates.

### Api

KoaJS app running on NodeJS that simply returns data to be displayed in the webapp. Also provides a socket connection for real time updates.

### Web App

Displays graphs and real time feed on events

## Improvements

Pretty much everything!
