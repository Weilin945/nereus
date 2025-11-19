import { Transaction } from "@mysten/sui/transactions";
// import { base } from "./package"; // Assumed existing local import
import { SuiClient } from "@mysten/sui/client";
import { bcs } from "@mysten/sui/bcs";

export async function getPrices(marketObjectId: string) {
  const tx = new Transaction();
  const client = new SuiClient({ url: "https://fullnode.testnet.sui.io:443" });
  
  // 1. Build the Move Call
  tx.moveCall({
    target: `0xb4e5d71c9937ee1b8736606f2230b89862d35f3e944f42f78bd8bc7876b66007::market::get_prices`,
    arguments: [tx.object(marketObjectId)],
  });

  // 2. Use devInspect to execute without gas/signing
  // We use a dummy sender address (all zeros) for inspection
  const result = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: "0x0000000000000000000000000000000000000000000000000000000000000000", 
  });

  // 3. Parse the results
  // devInspect structure: result.results[index].returnValues is an array of [bytes[], typeString] tuples
  if (result.results && result.results.length > 0) {
    const firstResult = result.results[0];

    if (firstResult.returnValues) {
      const parsedValues = firstResult.returnValues.map((item, index) => {
        const rawBytes = item[0] as number[]; // e.g. [0, 101, 205, 29, 0, 0, 0, 0]
        const typeType = item[1];             // e.g. "u64"

        if (typeType === 'u64') {
          // Convert number[] to Uint8Array
          const u8Array = new Uint8Array(rawBytes);
          // Parse using Little Endian (Standard for Sui/Move)
          const val = parseBytesToU64(u8Array, true); 
          console.log(`Value ${index}:`, val);
          return val;
        }
        return null;
      });
      console.log(parsedValues)
      return parsedValues;
    }
  }
  
  console.error("No return values found in inspection result");
  return null;
}

/**
 * Helper: Parses Uint8Array (8 bytes) to BigInt (u64)
 */
function parseBytesToU64(bytes: Uint8Array, littleEndian: boolean = false): bigint {
  if (bytes.length !== 8) {
    throw new Error(`Expected 8 bytes, got ${bytes.length}`);
  }
  
  // Create a DataView on the buffer
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  
  // getBigUint64 reads 8 bytes at the specified offset (0)
  return view.getBigUint64(0, littleEndian);
}