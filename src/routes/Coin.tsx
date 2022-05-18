import { useLocation } from "react-router-dom";
import styled from "styled-components";

interface RouterState {
   name: string;
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
`;

function Coin() {
    const location = useLocation();
    const {name} = location.state as RouterState;
    return (
        <Container>
            <Title>{name?.toUpperCase() || "Loading..."}</Title>
        </Container>
    )
}

export default Coin;