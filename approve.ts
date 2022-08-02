import { config } from "dotenv";
import { LedgerSigner } from "@ethersproject/hardware-wallets";
import { SafeService, SafeEthersSigner, SafeFactory } from "@gnosis.pm/safe-ethers-adapters";
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import Safe from '@gnosis.pm/safe-core-sdk'
import * as ethers from "ethers";
import ERC20 from "erc-20-abi/src/abi.json";
import { SAFE, USDC, AMOUNT_TO_BRIDGE, ETH_TOKEN_BRIDGE_ADDRESS} from './constants';

config({path: ".env.local"});


async function run() {
    const service = new SafeService("https://safe-transaction.gnosis.io/");
    const ethereumProvider = ethers.getDefaultProvider(process.env.ALCHEMY_URL)
    const signer = new LedgerSigner(ethereumProvider, "default", "m/44'/60'/0'/0/2")
    const ethAdapter = new EthersAdapter({ ethers, signer })
    const safe = await Safe.create({ ethAdapter, safeAddress: SAFE })
    const safeSigner = new SafeEthersSigner(safe, service, ethereumProvider)

    const USDC_contract = new ethers.Contract(USDC, ERC20, safeSigner);
    const allowance: ethers.BigNumber = await USDC_contract.allowance(SAFE, ETH_TOKEN_BRIDGE_ADDRESS)

    if (allowance.lt(AMOUNT_TO_BRIDGE)) {
        await USDC_contract.approve(
            ETH_TOKEN_BRIDGE_ADDRESS,
            AMOUNT_TO_BRIDGE
        );
    } else {
        console.log("Approved amount sufficient")
    }
}

run();
