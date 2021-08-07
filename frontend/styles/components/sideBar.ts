import styled from 'styled-components'
import { Close } from '@styled-icons/evaicons-solid'

export const CloseIcon = styled(Close)`
  color: ${props => props.theme.colors.primary};
  width: 50px;
  height: 50px;
`

export const Container = styled.nav<{ active: boolean }>`
  background-color: ${props => props.theme.colors.white};
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${props => (props.active ? 'left: 0' : '-100%')};
  transition: ${props => (props.active ? '.5s' : '.7s')};
  z-index: 2000;
  padding: 0 1.5rem 0 1.5rem;
  overflow-y: scroll;
`

export const NavMenuItems = styled.ul`
  width: 100%;
  list-style: none;
`

export const NavbarToggle = styled.li`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
