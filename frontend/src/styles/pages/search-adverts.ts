import styled from 'styled-components'
import { Filter as fIcon, Map, Money } from '@styled-icons/boxicons-regular'

export const FilterIcon = styled(fIcon)`
  color: ${props => props.theme.colors.primary};
  width: 30px;
  height: 30px;
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

export const Container = styled.div`
  padding: 50px 50px 20px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 3fr auto;
    grid-template-areas:
      'filter content'
      'filter pagination';
    width: 100vw;
    min-height: 100vh;
  }
`
export const FilterBar = styled.div`
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.secondary};
  margin-bottom: 1.5rem;
  border-radius: 5px;

  @media (min-width: 768px) {
    display: none;
  }
`

export const Filter = styled.div`
  grid-area: filter;
  background-color: ${props => props.theme.colors.text};
  display: none;
  width: 100%;
  height: 100%;
  @media (min-width: 768px) {
    display: block;
  }
`

export const Content = styled.div`
  grid-area: content;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: ${props => props.theme.colors.white};
  padding: 0 20px 0 20px;
`

export const PaginationContainer = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`
export const TitleOne = styled.p`
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
