import { ethers } from "ethers";
import { RequestHandler } from "../handlerBuilders";
import getMakerContracts from "../../../../core-backend/build/smart-contracts/maker";

const getCollateralRatio: RequestHandler<
  {},
  {},
  {},
  api.MakerCollateralRatio
> = async ({ services }) => {
  const makerContracts = getMakerContracts(services.provider);

  const ilkTypes = await makerContracts.ilkRegistry.list();

  const vatIlkPromises = [];

  for (const i of ilkTypes) {
    vatIlkPromises.push(makerContracts.vat.ilks(i));
  }

  const vatIlks = await Promise.all(vatIlkPromises);

  const collateralTypesWithDebt = ilkTypes.map((i, index) => {
    const vatIlk = vatIlks[index];

    const daiCreated = vatIlk.Art.mul(vatIlk.rate);

    return {
      name: ethers.utils.parseBytes32String(i),
      name32: i,
      daiCreated: Number(
        Number(ethers.utils.formatUnits(daiCreated, 45)).toFixed(2)
      ),
    };
  });

  return collateralTypesWithDebt.map((c) => ({
    collateral: c.name,
    dai: c.daiCreated,
  }));
};

export default getCollateralRatio;
