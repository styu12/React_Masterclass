import { useState } from "react";
import { useEffect } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

interface RouterState {
   name: string;
}

interface ICoinInfo {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface IPriceInfo {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_15m: number;
            percent_change_30m: number;
            percent_change_1h: number;
            percent_change_6h: number;
            percent_change_12h: number;
            percent_change_24h: number;
            percent_change_7d: number;
            percent_change_30d: number;
            percent_change_1y: number;
            ath_price: number;
            ath_date: string;
            percent_from_price_ath: number;
        }
    };
}

const Container = styled.div`
    max-width: 480px;
    margin: 30px auto;
`;

const Title = styled.h1`
    font-size: 45px;
    color: ${props => props.theme.accentColor};
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
`;

const Loader = styled.span`
    display: block;
    margin: 30px auto;
    font-size: 20px;
    text-align: center;
`;

const Overview = styled.div`
    width: 100%;
    height: 100px;
    margin: 20px 0;
    background-color: #2d3436;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 30px 0;
    justify-content: space-between;
    align-items: center;
    span:nth-child(1) {
        font-size: 13px;
    }
    span:nth-child(2) {
        font-size: 19px;
    }
`;

const Description = styled.p`
    font-size: 19px;
    line-height: 1.5;
    color: white;
`;

function Coin() {
    const location = useLocation();
    const {coinId} = useParams();
    const {name} = location.state ? location.state as RouterState : {name: null};
    const [loading, setLoading] = useState(true);
    const [coinInfo, setCoinInfo] = useState<ICoinInfo>();
    const [priceInfo, setPriceInfo] = useState<IPriceInfo>();


    useEffect(() => {
        ( async() => {
            const coinApi = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
            const priceApi = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();
            setCoinInfo(coinApi);
            setPriceInfo(priceApi);
            setLoading(false);
        } )();
    }, [coinId]);
    return (
        <Container>
            <Title>{name ? name?.toUpperCase() : loading ? <Loader>Loading...</Loader> : coinInfo?.name}</Title>
            {loading ? <Loader>Loading...</Loader> : (
                <>
                <Overview>
                    <OverviewItem>
                        <span>RANK</span>
                        <span>{priceInfo?.rank}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>SYMBOL</span>
                        <span>${priceInfo?.symbol}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>OPEN SOURCE</span>
                        <span>{coinInfo?.open_source ? "Yes" : "No"}</span>
                    </OverviewItem>
                </Overview>

                <Description>{coinInfo?.description}</Description>

                <Overview>
                    <OverviewItem>
                        <span>TOTAL SUPPLY</span>
                        <span>{priceInfo?.total_supply}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>MAX SUPPLY</span>
                        <span>{priceInfo?.max_supply}</span>
                    </OverviewItem>
                </Overview>

                <Routes>
                    <Route path="chart" element={<Chart />} />
                    <Route path="price" element={<Price />} />
                </Routes>
                </>
            )}
        </Container>
    )
}

export default Coin;