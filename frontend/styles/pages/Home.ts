import styled from 'styled-components'
import { Search, Map, Money } from '@styled-icons/boxicons-regular'

export const Image = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('/home.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: cover;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    z-index: -1;
  }
`
export const SearchIcon = styled(Search)`
  color: #f5f5f5;
  width: 20px;
  height: 20px;
`
export const Title = styled.p`
  font-size: 1.8rem;
  color: #f5f5f5;
  z-index: 1;
`
export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
  justify-content: center;
  align-items: flex-start;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  padding: 30px 20px 30px 20px;
`

export const MapIcon = styled(Map)`
  color: ${props => props.theme.colors.primary};
  width: 20px;
  height: 20px;
`

export const MoneyIcon = styled(Money)`
  color: ${props => props.theme.colors.primary};
  width: 20px;
  height: 20px;
`
