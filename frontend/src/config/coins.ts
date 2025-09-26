export interface Coin {
  id: string;
  name: string;
}

export const coins: Coin[] = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "ripple", name: "Ripple" },
  { id: "litecoin", name: "Litecoin" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
  { id: "polkadot", name: "Polkadot" },
  { id: "solana", name: "Solana" },
  { id: "binancecoin", name: "Binance Coin" },
];

export const getCoinName = (id: string): string => {
  const coin = coins.find((c) => c.id === id);
  return coin ? coin.name : id.charAt(0).toUpperCase() + id.slice(1);
};
