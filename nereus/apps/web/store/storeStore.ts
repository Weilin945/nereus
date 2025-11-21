import { create } from "zustand";
import { gqlQuery } from "@/utils/gql";
import { base, market } from "./move/package";
import { getPrices } from "./move/getPriceCaller";

export type Market = {
  address: string;
  balance: number;
  description: string;
  topic: string;
  start_time: number;
  end_time: number;
  no: number;
  yes: number;
  oracle_config: string;
  yesprice?: bigint;
  noprice?: bigint;
  category?: string;
};

type User = {
  USDC: string[]; // Array of USDC coin object IDs
  YesPositions: string[]; // Array of YES Position object IDs
  NoPositions: string[];  // Array of NO Position object IDs
};

type StoreState = {
  marketList: Market[];
  user: User;
  selectedMarket: Market | null;
  selectedSide: "Yes" | "No" | null;
  setMarketList: (markets: Market[]) => void;
  setSelectedMarket: (market: Market | null) => void;
  queryMarkets: () => Promise<void>;
  fetchUser: (userAddress: string) => Promise<void>;
  selectTrade: (market: Market, side: "Yes" | "No") => void;
};

export const storeStore = create<StoreState>((set) => ({
  marketList: [],
  selectedMarket: null,
  selectedSide: null,
  user: { USDC: [], YesPositions: [], NoPositions: [] },
  

  queryMarkets: async () => {
    const res = await gqlQuery(`
      {
        objects(filter: { type: "${market}::Market" }) {
          nodes {
            address
            digest
            asMoveObject {
              contents {
                json
              }
            }
          }
        }
      }
    `);
    const data = res.data;
    const nodes = data?.objects.nodes || [];

    // 這裡邏輯很好，使用 Promise.all 並行處理價格查詢效率較高
    const marketPromises = nodes.map(async (node: any) => {
      const content = node.asMoveObject.contents.json;
      const prices = await getPrices(node.address);

      // Extract category from topic using regex
      const regex = /#([a-zA-Z0-9]+)/;
      const match = content.topic.match(regex);

      let category = null;
      let topic = content.topic;

      if (match) {
      category = match[1];
      topic = content.topic.replace(match[0], "").trim();
      }

      return {
      address: node.address,
      balance: parseInt(content.balance),
      description: content.description,
      topic: topic,
      start_time: parseInt(content.start_time),
      end_time: parseInt(content.end_time),
      no: parseInt(content.no),
      yes: parseInt(content.yes),
      oracle_config: content.oracle_config_id,
      yesprice: prices ? prices[0] : undefined,
      noprice: prices ? prices[1] : undefined,
      category,
      };
    });

    const markets = await Promise.all(marketPromises);
    console.log("marketList (processed)", markets);
    
    set({
      marketList: markets,
    });
  },

  fetchUser: async (userAddress: string) => {
    const res = await gqlQuery(`
      {
  address(address: "${userAddress}") {
    balance(coinType: "${base}::usdc::USDC") {
      totalBalance
    }
    
    objects(filter: {
      type: "0x2::coin::Coin<${base}::usdc::USDC>"
    }) {
      nodes {
        address 
        }
      }
    }
  }
    `);
    // Parse the response and update state
    const nodes = res.data?.address?.objects?.nodes || [];
    const usdcIds = nodes.map((obj: any) => obj.address);

    set((state) => ({
      user: {
      ...state.user,
      USDC: usdcIds,
      },
    }));
    
    console.log("User USDC fetched:", usdcIds);
  },

  setMarketList: (markets: Market[]) => set({ marketList: markets }),
  setSelectedMarket: (market: Market | null) => set({ selectedMarket: market }),
  selectTrade: (market, side) => set({ selectedMarket: market, selectedSide: side }),
  getallcat(): string[] {

},
}));