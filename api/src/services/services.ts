import { ethers } from "ethers";

export type Services = {
  auth: api.IAuthService;
  socket: api.ISocketService;
  mysql: data.DataClients;
  provider: ethers.providers.Provider;
};
