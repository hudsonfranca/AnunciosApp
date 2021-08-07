import styled from 'styled-components'
import { Pricetags, Person, Phone, Map } from '@styled-icons/evaicons-solid'

export const Container = styled.div`
  padding: 30px 30px 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
  width: 100vw;
  min-height: 100vh;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 3fr auto;
    grid-template-areas:
      'images content'
      'desc null';
  }
`

export const Images = styled.div`
  grid-area: images;
  background-color: ${props => props.theme.colors.text};
  width: 100%;
  height: 100%;
`

export const Content = styled.ul`
  grid-area: content;
  width: 100%;
  height: 80%;
  display: grid;

  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, 1fr);
  justify-content: space-around;
  align-items: center;
  align-self: flex-start;
  background-color: ${props => props.theme.colors.text};
  list-style: none;
`

export const ContentItem = styled.li`
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgba(5, 56, 107, 0.5);
  transition: 0.5s;
  display: flex;
  justify-content: end;
  align-items: center;

  flex-direction: row;

  &:first-child {
    font-size: 1.4rem;
    justify-content: end;
  }
`

export const Cards = styled.div`
  grid-area: cards;
  background-color: ${props => props.theme.colors.text};
  width: 100%;
  height: 100%;
`
export const Description = styled.div`
  grid-area: desc;
  background-color: ${props => props.theme.colors.text};
  width: 100%;
  height: 100%;
  padding: 5px;
`
export const PhoneIcon = styled(Phone)`
  color: ${props => props.theme.colors.primary};
  width: 30px;
  height: 30px;
`

export const PricetagsIcon = styled(Pricetags)`
  color: ${props => props.theme.colors.primary};
  width: 30px;
  height: 30px;
`

export const PersonIcon = styled(Person)`
  color: ${props => props.theme.colors.primary};
  width: 30px;
  height: 30px;
`
export const MapIcon = styled(Map)`
  color: ${props => props.theme.colors.primary};
  width: 30px;
  height: 30px;
`
