import styled from 'styled-components'
import { CheckboxChecked } from '@styled-icons/boxicons-regular'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.white};
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 992px) {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1.5fr 2fr;
    grid-template-rows: 1fr;
  }
`
export const Card = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.white};
  flex-direction: column;
  padding: 10%;
`
export const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('/signup.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: cover;
  z-index: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: none;
  padding: 5%;

  @media (min-width: 992px) {
    display: flex;
  }

  ::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: #000;
    position: absolute;
    top: 0;
    opacity: 0.6;
    z-index: -1;
    display: none;
    @media (min-width: 992px) {
      display: flex;
    }
  }
`

export const Title = styled.p`
  color: #000;
  font-size: 1.5rem;
  margin: 0px;
  z-index: 10;
  color: ${props => props.color || '#000'};
`

export const Ul = styled.ul`
  color: #f4f4f4;
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`
export const Li = styled.li`
  display: flex;
  justify-content: space-around;
  height: auto;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const CheckboxIcon = styled(CheckboxChecked)`
  color: #f5f5f5;
  width: 40px;
  height: 40px;
`

export const Login = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;

  strong {
    padding: 2px;
  }
`
