import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 3fr auto;
  grid-template-areas:
    'filter content'
    'filter pagination';
  width: 100vw;
  min-height: 100vh;
  padding: 20px;
`

export const Filter = styled.div`
  grid-area: filter;
  background-color: ${props => props.theme.colors.white};
`

export const Content = styled.div`
  grid-area: content;
  background-color: ${props => props.theme.colors.white};
  padding: 0 20px 0 20px;
`

export const PaginationContainer = styled.div`
  grid-area: pagination;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const OptionsContainer = styled.div`
  height: 160px;
  overflow-y: auto;
  padding-top: 5px;
  padding-left: 4px;
`

export const TitleOne = styled.p`
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const TitleTwo = styled.p`
  font-size: 1.2rem;
  width: 100%;
  height: auto;
  background-color: ${props => props.theme.colors.tertiary};
  color: #fff;
  border-radius: 4px 4px 0 0;
  padding-left: 4px;
`
