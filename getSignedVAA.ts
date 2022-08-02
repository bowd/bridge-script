import {
    getEmitterAddressEth,
	getSignedVAA,
    CHAIN_ID_ETH,
} from '@certusone/wormhole-sdk';

const ETH_TOKEN_BRIDGE_ADDRESS = "0x3ee18B2214AFF97000D974cf647E7C347E8fa585";
const SEQUENCE = "129ED"; // "76269";
const WORMHOLE_RPC_HOST = "wormhole-v2-mainnet-api.certus.one";

async function run() {
    const emitterAddress = getEmitterAddressEth(ETH_TOKEN_BRIDGE_ADDRESS);
    const resp = await getSignedVAA(
        WORMHOLE_RPC_HOST,
        CHAIN_ID_ETH,
        emitterAddress,
        SEQUENCE,
    );
    console.log("Asd")
    console.log(resp);
}

// Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
run();