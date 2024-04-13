import { Sourcify } from "@nomicfoundation/hardhat-verify/sourcify";

const instance = new Sourcify(137, "https://sourcify.dev/server", "https://repo.sourcify.dev"); // Set chainId

const main = async () => {
  const verified = await instance.isVerified("0xeb65d2b4650AFE8Ee204CDaA4f9621a839b403ec");
  console.log(verified);
  if (!verified) {
    const sourcifyResponse = await instance.verify("0xeb65d2b4650AFE8Ee204CDaA4f9621a839b403ec", {});
    console.log(sourcifyResponse);
    if (sourcifyResponse.isOk()) {
      const contractURL = instance.getContractUrl(
        "0xeb65d2b4650AFE8Ee204CDaA4f9621a839b403ec",
        sourcifyResponse.status,
      );
      console.log(`Successfully verified contract on Sourcify: ${contractURL}`);
    }
  }
};

main();
