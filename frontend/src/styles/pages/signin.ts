import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
`
export const Card = styled.div`
  width: 35%;
  height: 50%;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 1px 2px 15px 5px rgba(0, 0, 0, 0.43);
  padding: 35px;
`
