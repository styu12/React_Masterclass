import { useState } from "react";
import { useEffect } from "react";
import {Helmet} from "react-helmet";
import { useQuery } from "react-query";
import { Link, Route, Routes, useLocation, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchTickerInfo } from "../api";
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

const BackBtn = styled.button`
    font-size: 16px;
    background-color: transparent;
    color: ${props => props.theme.textColor};
    border: none;
    cursor: pointer;
    &:hover {
        color: ${props => props.theme.accentColor};
    }
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

const Tabs = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const Tab = styled.div<{isActive: boolean}>`
    width: 45%;
    height: 50px;
    background-color: #2d3436;
    border-radius: 15px;
    color: ${props => props.isActive ? props.theme.accentColor : props.theme.textColor};
    a {
        display: block;
        text-align:center;
        font-size: 17px;
        padding-top: 15px;
        width: 100%;
        height: 100%;
    }
`;

interface ICoinProps {
}

function Coin({}:ICoinProps) {
    const location = useLocation();
    const {coinId} = useParams();
    const {name} = location.state ? location.state as RouterState : {name: null};
    const {isLoading: infoLoading, data: infoData} = useQuery<ICoinInfo>(
        ["info", coinId], 
        () => fetchCoinInfo(coinId)
    );
    const {isLoading: priceLoading, data: priceData} = useQuery<IPriceInfo>(
        ["tickers", coinId],
        () => fetchTickerInfo(coinId),
        {
            refetchInterval: 5000,
        }
    );
    const loading = infoLoading || priceLoading;
    const chartMatch = useMatch('/:coinId/chart');
    const priceMatch = useMatch('/:coinId/price');
    return (
        <Container>
            <Helmet>
                <title>HCoins | {name ? name?.toUpperCase() : loading ? <Loader>Loading...</Loader> : infoData?.name}</title>
            </Helmet>
            <Link to='/'>
                <BackBtn>BACK &larr;</BackBtn>
            </Link>
            <Title>{name ? name?.toUpperCase() : loading ? <Loader>Loading...</Loader> : infoData?.name}</Title>
            {loading ? <Loader>Loading...</Loader> : (
                <>
                <Overview>
                    <OverviewItem>
                        <span>RANK</span>
                        <span>{priceData?.rank}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>SYMBOL</span>
                        <span>${priceData?.symbol}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>PRICE</span>
                        <span>${priceData?.quotes.USD.price.toFixed(2)}</span>
                    </OverviewItem>
                </Overview>

                <Description>{infoData?.description}</Description>

                <Overview>
                    <OverviewItem>
                        <span>TOTAL SUPPLY</span>
                        <span>{priceData?.total_supply}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>MAX SUPPLY</span>
                        <span>{priceData?.max_supply}</span>
                    </OverviewItem>
                </Overview>
                
                <Tabs>
                    <Tab isActive={chartMatch !== null}>
                        <Link to="chart">Chart</Link>
                    </Tab>
                    <Tab isActive={priceMatch !== null}>
                        <Link to="price">Price</Link>
                    </Tab>
                </Tabs>

                <Routes>
                    <Route path="chart" element={<Chart coinId={coinId} />} />
                    <Route path="price" element={<Price />} />
                </Routes>
                </>
            )}
        </Container>
    )
}

export default Coin;