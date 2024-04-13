import { DeployFunction } from "hardhat-deploy/types";
import { Ship } from "../utils";
import { NativeBridge__factory } from "../types";

const func: DeployFunction = async (hre) => {
  const { deploy, accounts } = await Ship.init(hre);

  await deploy(NativeBridge__factory, {
    args: [accounts.deployer.address],
  });
};

export default func;
func.tags = ["bridge"];
