import { create } from "zustand";
import { gqlQuery } from "@/utils/gql";
import { market } from "./move/package";
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
      
      return {
        address: node.address,
        balance: parseInt(content.balance),
        description: content.description,
        topic: content.topic,
        start_time: parseInt(content.start_time),
        end_time: parseInt(content.end_time),
        no: parseInt(content.no),
        yes: parseInt(content.yes),
        oracle_config: content.oracle_config_id,
        yesprice: prices ? prices[0] : undefined,
        noprice: prices ? prices[1] : undefined,
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
      query {
        coins(
          ownerAddress: "${userAddress}",
          coinType: "0xb4e5d71c9937ee1b8736606f2230b89862d35f3e944f42f78bd8bc7876b66007::usdc::USDC"
        ) {
          nodes {
            objectId
            balance
            coinType
          }
        }
      }
    `);

    // [修正 3] 解析資料並更新 State
    const nodes = res.data?.coins?.nodes || [];
    
    // 假設你的 User type 定義 USDC 是 string[] (Object IDs)
    const usdcIds = nodes.map((coin: any) => coin.objectId);

    set((state) => ({
      user: {
        ...state.user, // 保留原本的 Positions (如果有的話)
        USDC: usdcIds,
      },
    }));
    
    console.log("User USDC fetched:", usdcIds);
  },

  setMarketList: (markets: Market[]) => set({ marketList: markets }),
  setSelectedMarket: (market: Market | null) => set({ selectedMarket: market }),
  selectTrade: (market, side) => set({ selectedMarket: market, selectedSide: side }),
}));