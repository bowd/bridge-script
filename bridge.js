import { LedgerSigner } from "@ethersproject/hardware-wallets";
import * as ethers from "ethers";

const ethereumProvider = ethers.getDefaultProvider(null, {})

const signer = new LedgerSigner(ethereumProvider, "default", "m/44'/60'/0'/0/0");
console.log("Hello");
console.log(await signer.signMessage("asdasd"));