import React from 'react'
import {
  CloseIcon,
  Container,
  NavMenuItems,
  NavbarToggle
} from '../styles/components/sideBar'

interface Props {
  sidebar: boolean
  showSidebar(): void
}

export const SideBar: React.FC<Props> = ({
  showSidebar,
  sidebar,
  children
}) => {
  return (
    <Container active={sidebar}>
      <NavMenuItems>
        <NavbarToggle onClick={() => showSidebar()}>
          <CloseIcon />
        </NavbarToggle>
        <li>{children}</li>
      </NavMenuItems>
    </Container>
  )
}
