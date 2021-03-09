import { ethers, BigNumber, Signer } from "ethers";
import {
  vatABI,
  vowABI,
  mkrABI,
  daiABI,
  ilkRegistryABI,
  jugABI,
  cdpManagerABI,
  flapABI,
  spotABI,
  pipEthABI,
  psmUSDCABI,
  catABI,
} from "./abi";

type EthersOptions = {
  blockTag?: number;
  gasPrice?: number;
  gasLimit?: number;
};

export type MakerContractAddresses = { [K in keyof MakerContracts]: string };

export type VatIlk = {
  Art: BigNumber;
  rate: BigNumber;
  line: BigNumber;
  dust: BigNumber;
  spot: BigNumber;
};

export type VatUrn = {
  ink: BigNumber;
  art: BigNumber;
};

export interface VatContract extends ethers.Contract {
  dai(address: string, options?: EthersOptions): Promise<BigNumber>;
  sin(address: string, options?: EthersOptions): Promise<BigNumber>;
  ilks(collateralType: string, options?: EthersOptions): Promise<VatIlk>;
  debt(options?: EthersOptions): Promise<BigNumber>;
  vice(options?: EthersOptions): Promise<BigNumber>;
  urns(
    collateralType: string,
    address: string,
    options?: EthersOptions
  ): Promise<VatUrn>;
}

export interface VowContract extends ethers.Contract {
  hump(options?: EthersOptions): Promise<BigNumber>;
  bump(options?: EthersOptions): Promise<BigNumber>;
  Sin(options?: EthersOptions): Promise<BigNumber>;
  flap(options?: EthersOptions): Promise<number>;
}

export interface ERC20 {
  totalSupply(options?: EthersOptions): Promise<BigNumber>;
  transfer(
    address: string,
    value: string,
    options?: EthersOptions
  ): Promise<void>;
  balanceOf(address: string, options?: EthersOptions): Promise<BigNumber>;
  approve(address: string, amount: string): Promise<ethers.Transaction>;
}

export interface IlkRegistryContract {
  list(options?: EthersOptions): Promise<string[]>;
}

export interface CDPManagerContract {
  open(
    ilk: string,
    address: string,
    options?: EthersOptions
  ): Promise<ethers.Transaction>;
  frob(
    cdp: string,
    dink: string,
    dart: string,
    options?: EthersOptions
  ): Promise<ethers.Transaction>;
  cdpi(options?: EthersOptions): Promise<BigNumber>;
  urns(id: string, options?: EthersOptions): Promise<string>;
  last(address: string, options?: EthersOptions): Promise<BigNumber>;
}

export type JugIlk = {
  duty: BigNumber;
  rho: BigNumber;
};

export interface JugContract extends ethers.Contract {
  base(options?: EthersOptions): Promise<BigNumber>;
  ilks(collateralType: string, options?: EthersOptions): Promise<JugIlk>;
}

export type SpotIlk = {
  mat: BigNumber;
  pip: any;
};

export interface SpotContract extends ethers.Contract {
  ilks(collateralType: string, options?: EthersOptions): Promise<SpotIlk>;
}

export interface PipContract {
  peek(options?: EthersOptions): Promise<BigNumber>;
  read(options?: EthersOptions): Promise<BigNumber>;
}

export type FlapBid = {
  bid: BigNumber;
  end: number;
  guy: string;
  lot: BigNumber;
  tic: number;
};

export interface FlapContract extends ethers.Contract {
  kicks(): Promise<BigNumber>;
  ttl(options?: EthersOptions): Promise<number>;
  bids(id: string): Promise<FlapBid>;
}

export interface JoinEthAContract {
  join(urn: string, wad: string): Promise<ethers.Transaction>;
}

export interface PSMUSDCContract extends ethers.Contract {}

type CatIlk = {
  flip: string;
  chop: BigNumber;
  lump: BigNumber;
};

export interface CatContract extends ethers.Contract {
  ilks(collateralType: string, options?: EthersOptions): Promise<CatIlk>;
}

const contractABIs: MakerContractAddresses = {
  vat: JSON.stringify(vatABI),
  vow: JSON.stringify(vowABI),
  mkr: JSON.stringify(mkrABI),
  dai: JSON.stringify(daiABI),
  ilkRegistry: JSON.stringify(ilkRegistryABI),
  jug: JSON.stringify(jugABI),
  cdpManager: JSON.stringify(cdpManagerABI),
  spot: JSON.stringify(spotABI),
  ethPip: JSON.stringify(pipEthABI),
  flap: JSON.stringify(flapABI),
  psmUSDC: JSON.stringify(psmUSDCABI),
  cat: JSON.stringify(catABI),
};

const getContract = (
  addresses: MakerContractAddresses,
  signer: Signer | ethers.providers.Provider
) => <T>(contract: keyof MakerContractAddresses): T => {
  const abi = contractABIs[contract];
  return new ethers.Contract(addresses[contract], abi, signer) as any;
};

const getMakerContracts = (
  signer: Signer | ethers.providers.Provider,
  addresses: MakerContractAddresses
) => {
  const contract = getContract(addresses, signer);

  return {
    vat: contract<VatContract>("vat"),
    vow: contract<VowContract>("vow"),
    mkr: contract<ERC20>("mkr"),
    dai: contract<ERC20>("dai"),
    ilkRegistry: contract<IlkRegistryContract>("ilkRegistry"),
    jug: contract<JugContract>("jug"),
    cdpManager: contract<CDPManagerContract>("cdpManager"),
    spot: contract<SpotContract>("spot"),
    ethPip: contract<PipContract>("ethPip"),
    flap: contract<FlapContract>("flap"),
    psmUSDC: contract<PSMUSDCContract>("psmUSDC"),
    cat: contract<CatContract>("cat"),
  };
};

export type MakerContracts = {
  vat: VatContract;
  vow: VowContract;
  mkr: ERC20;
  dai: ERC20;
  ilkRegistry: IlkRegistryContract;
  jug: JugContract;
  cdpManager: CDPManagerContract;
  spot: SpotContract;
  ethPip: PipContract;
  flap: FlapContract;
  psmUSDC: PSMUSDCContract;
  cat: CatContract;
};

const getHomesteadMakerContracts = (
  signer: Signer | ethers.providers.Provider
): MakerContracts =>
  getMakerContracts(signer, {
    vat: "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B",
    vow: "0xA950524441892A31ebddF91d3cEEFa04Bf454466",
    mkr: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    dai: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ilkRegistry: "0x8b4ce5DCbb01e0e1f0521cd8dCfb31B308E52c24",
    jug: "0x19c0976f590D67707E62397C87829d896Dc0f1F1",
    cdpManager: "0x5ef30b9986345249bc32d8928B7ee64DE9435E39",
    spot: "0x65C79fcB50Ca1594B025960e539eD7A9a6D434A3",
    ethPip: "0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763",
    flap: "0xC4269cC7acDEdC3794b221aA4D9205F564e27f0d",
    psmUSDC: "0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A",
    cat: "0x78F2c2AF65126834c51822F56Be0d7469D7A523E",
  });

export default getHomesteadMakerContracts;
