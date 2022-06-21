
const BASE_URL = 'https://api.coinpaprika.com/v1';

export async function fetchCoins() {
    const json = await fetch(`${BASE_URL}/coins`).then((response) => response.json());
    return json;
}

export async function fetchCoinInfo(coinId: string | undefined) {
    const json = await fetch(`${BASE_URL}/coins/${coinId}`).then((response) => response.json());
    return json;
}

export async function fetchTickerInfo(coinId: string | undefined) {
    const json = await fetch(`${BASE_URL}/tickers/${coinId}`).then((response) => response.json());
    return json;
}

export async function fetchCoinHistory(coinId: string | undefined) {
    const endDate = Math.floor(Date.now()/1000);
    const startDate = endDate - (60 * 60 * 12);
    const json = await fetch(`${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`).then((response) => response.json());
    return json;
}