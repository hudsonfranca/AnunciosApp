import styled from 'styled-components'
import { Map, Money } from '@styled-icons/boxicons-regular'

export const Container = styled.div`
  padding: 50px 50px 20px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
  width: 100vw;
  min-height: 100vh;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: auto 3fr auto;

    grid-template-areas:
      'options title'
      'options adverts'
      'options pagination';
  }
`

export const Title = styled.div`
  grid-area: title;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  border-radius: 5px;
`

export const Options = styled.div`
  grid-area: options;

  background-color: ${props => props.theme.colors.text};
  width: 100%;
  height: 100%;
  @media (min-width: 768px) {
    display: block;
  }
`

export const Adverts = styled.div`
  grid-area: adverts;

  width: 100%;
  height: 100%;
  display: grid;
`

export const OptionsContainer = styled.ul`
  height: 100%;
  width: 100%;
  border-radius: 5px;
  list-style: none;
  padding: 5px;
`

export const OptionsItems = styled.li`
  height: 50px;
  width: 100%;
  cursor: pointer;
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 5px;
  padding: 2px;
  transition: 0.6s;
  font-size: 1.3rem;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &:first-child {
    margin-bottom: 10px;
  }

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`
export const TitleTwo = styled.p`
  font-size: 1.2rem;
  width: 100%;
  height: auto;
  background-color: ${props => props.theme.colors.secondary};
  color: #fff;
  border-radius: 5px 5px 0 0;
  padding-left: 4px;
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
  justify-content: center;
  align-items: flex-start;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
`

export const NotFound = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.secondary};
  border-radius: 5px;
  color: ${props => props.theme.colors.text};
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
export const PaginationContainer = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`
