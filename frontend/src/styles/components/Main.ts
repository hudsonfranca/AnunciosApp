import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border-top: 4px solid ${props => props.theme.colors.quaternary};
  border-bottom: 4px solid ${props => props.theme.colors.quaternary};
`
