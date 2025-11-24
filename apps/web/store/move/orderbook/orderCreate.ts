import { Transaction } from "@mysten/sui/transactions";
import { market as PACKAGE_ID } from "../package";

// New order creation: deposit USDC first, then post order
export function orderCreateTx(
    tx: Transaction,
    user: string,
    marketId: string,
    usdcAmount: bigint,
    expectedShares: number,
    role: number,
    token: number,
    exp: number,
    salt: number,
    fundingCoin: any
): Transaction {
    // 1. Deposit USDC
    tx.moveCall({
        target: `${PACKAGE_ID}::deposit_usdc`,
        arguments: [
            tx.object(marketId),
            fundingCoin,
        ]
    });

    // 2. Post order
    // 注意：0x5aad 版本的 post_order 需要 Clock 作為第三個參數
    tx.moveCall({
        target: `${PACKAGE_ID}::post_order`,
        arguments: [
            tx.object(marketId), // arg0: Market
            tx.moveCall({        // arg1: Order
                target: `${PACKAGE_ID}::create_order`,
                arguments: [
                    tx.pure.address(user),       // maker
                    tx.pure.u64(usdcAmount),     // maker_amount
                    tx.pure.u64(expectedShares), // taker_amount
                    tx.pure.u8(role),            // maker_role
                    tx.pure.u8(token),           // token_id
                    tx.pure.u64(exp),            // expiration
                    tx.pure.u64(salt),           // salt
                ]
            }),
            tx.object('0x6')     // arg2: Clock (新增參數)
        ],
    });
    return tx;
}