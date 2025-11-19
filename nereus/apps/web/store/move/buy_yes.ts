import { Transaction } from "@mysten/sui/transactions";
import { market as PACKAGE_ID } from "./package"; // Renamed to avoid conflict with argument

export function buyYesTx(
    tx: Transaction,
    USDC: string[],   // Array of USDC coin object IDs
    marketId: string, // The Market Object ID
    yesPositions: string[] | undefined, // Array of existing YES Position IDs
    amount: bigint,   // The amount of USDC to bet
    userAddress: string // Required to transfer the new object if we create one
): Transaction {
    
    // 1. Handle USDC Payment
    // We must provide a coin with EXACTLY 'amount' value.
    if (USDC.length === 0) throw new Error("No USDC coins provided");
    
    const primaryCoin = tx.object(USDC[0]);
    
    // If multiple USDC coins, merge them into the first one to ensure sufficient balance
    if (USDC.length > 1) {
        tx.mergeCoins(primaryCoin, USDC.slice(1).map(id => tx.object(id)));
    }

    // Split off the exact amount required for the bet
    const [paymentCoin] = tx.splitCoins(primaryCoin, [tx.pure.u64(amount)]);

    // 2. Handle YES Position Object
    // We need a 'Yes' object to add the shares to. 
    let targetYesPosition;
    let isNewPosition = false;

    if (yesPositions && yesPositions.length > 0) {
        // Use the first existing position found
        targetYesPosition = tx.object(yesPositions[0]);
    } else {
        // If no position exists, we must mint a zero_yes ticket first
        isNewPosition = true;
        targetYesPosition = tx.moveCall({
            target: `${PACKAGE_ID}::market::zero_yes`,
            arguments: [tx.object(marketId)],
        });
    }

    // 3. Execute the Bet
    tx.moveCall({
        target: `${PACKAGE_ID}::market::bet_yes`,
        arguments: [
            targetYesPosition,      // &mut Yes
            tx.object(marketId),    // &mut Market
            tx.pure.u64(amount),    // amount (u64)
            paymentCoin,            // Coin<USDC> (exact value)
            tx.object("0x6")        // &Clock (System Clock)
        ]
    });

    // 4. Cleanup
    // If we created a new Position object, we must transfer it to the user.
    // If we used an existing one, it remains in their wallet (shared/owned).
    if (isNewPosition) {
        tx.transferObjects([targetYesPosition], tx.pure.address(userAddress));
    }

    return tx;
}