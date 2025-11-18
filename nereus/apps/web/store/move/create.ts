import { Transaction } from "@mysten/sui/transactions";
import {market} from "./package";

export function createMarketTx(
    tx: Transaction,
    objlist: any,
    topic: string,
    description: string,
    start_time: number,
    end_time: number
): Transaction {
    tx.moveCall({
        target: market+"::create_market",
        arguments: [
            tx.object(objlist[0]),
            tx.pure.string(topic),
            tx.pure.string(description),
            tx.pure.u64(start_time),
            tx.pure.u64(end_time)
        ]
    })
    tx.moveCall({
        target: "0x2::transfer::public_share_object",
        arguments: [
            tx.object(objlist[0]),
        ]
    })
        tx.moveCall({
        target: "0x2::transfer::public_share_object",
        arguments: [
            tx.object(objlist[1]),
        ]
    })
    return tx;
}