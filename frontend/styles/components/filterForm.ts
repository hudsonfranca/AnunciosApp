import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
`

export const TitleTwo = styled.p`
  font-size: 1.2rem;
  width: 100%;
  height: auto;
  background-color: ${props => props.theme.colors.secondary};
  color: #fff;
  border-radius: 4px 4px 0 0;
  padding-left: 4px;
`
export const OptionsContainer = styled.ul`
  height: 160px;
  overflow-y: auto;
  padding-top: 5px;
  padding-left: 4px;
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 5px;
  list-style: none;
  margin-bottom: 10px;
`

export const OptionsItems = styled.li<{ selected: boolean }>`
  cursor: pointer;
  margin: 1px 0 1px 0;
  background-color: ${props => props.selected && props.theme.colors.quaternary};
  border-radius: 5px;
  padding: 2px;

  &:hover {
    text-decoration: underline;
  }
`
