import { config } from "dotenv";
import { LedgerSigner } from "@ethersproject/hardware-wallets";
import { SafeService, SafeEthersSigner, SafeFactory } from "@gnosis.pm/safe-ethers-adapters";
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import Safe from '@gnosis.pm/safe-core-sdk'
import * as ethers from "ethers";
import {
	transferFromEth,
	parseSequenceFromLogEth,
	getEmitterAddressEth,
    CHAIN_ID_CELO,
    hexToUint8Array,
    Migrations,
    redeemAndUnwrapOnSolana
} from '@certusone/wormhole-sdk';
import ERC20 from "erc-20-abi/src/abi.json";
import { SAFE, USDC, AMOUNT_TO_BRIDGE, ETH_TOKEN_BRIDGE_ADDRESS, RECIPIENT } from './constants';

config({path: ".env.local"});

async function run() {
    const service = new SafeService("https://safe-transaction.gnosis.io/");
    const ethereumProvider = ethers.getDefaultProvider(process.env.ALCHEMY_URL)
    const signer = new LedgerSigner(ethereumProvider, "default", "m/44'/60'/0'/0/2")
    const ethAdapter = new EthersAdapter({ ethers, signer })
    const safe = await Safe.create({ ethAdapter, safeAddress: SAFE })
    const safeSigner = new SafeEthersSigner(safe, service, ethereumProvider)

    const receipt = await transferFromEth(
        ETH_TOKEN_BRIDGE_ADDRESS,
        safeSigner,
        USDC,
        AMOUNT_TO_BRIDGE,
        CHAIN_ID_CELO,
        hexToUint8Array(RECIPIENT)
    );
    // Get the sequence number and emitter address required to fetch the signedVAA of our message
    const sequence = parseSequenceFromLogEth(receipt, ETH_TOKEN_BRIDGE_ADDRESS);
    const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
}

run();
