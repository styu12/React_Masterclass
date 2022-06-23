import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";

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

const CoinsList = styled.ul`
    width: 100%;
    padding: 10px 20px;
`;

const Coin = styled.li`
    width: 100%;
    font-size: 15px;
    font-weight: 500;
    background-color: white;
    color: ${props => props.theme.bgColor};
    border-radius: 15px;
    margin: 10px 0;
    a {
        display: flex;
        align-items: center;
        padding: 20px;
        transition: color .3s ease-in;
    }
    &:hover {
        color: ${props => props.theme.accentColor};
    }
`;

const CoinIcon = styled.img`
    width: 35px;
    height: 35px;
    margin-right: 15px;
`;

const Loader = styled.span`
    display: block;
    margin: 30px auto;
    font-size: 20px;
    text-align: center;
`;

interface CoinInterface {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
}

interface ICoinsProps {
}

function Coins({}: ICoinsProps) {
    const setDark = useSetRecoilState(isDarkAtom);
    const toggleDark = () => setDark(prev => !prev);
    const {isLoading, data} = useQuery<CoinInterface[]>("allCoins", fetchCoins, {
        refetchInterval: 10000,
    });
    return (
        <Container>
            <Helmet>
                <title>HCoins</title>
            </Helmet>
            <Title>COIN TRACKER
                <button onClick={toggleDark}>Toggle Dark</button>
            </Title>
            <CoinsList>
                {isLoading ? <Loader>Loading...</Loader> : (
                    data?.slice(0,100).map((coin) => (
                        <Coin key={coin.id}>
                            <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                                <CoinIcon src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
                                {coin.name} &rarr;
                            </Link>
                        </Coin>
                    ))
                )}
                
            </CoinsList>
        </Container>
    )
}

export default Coins;