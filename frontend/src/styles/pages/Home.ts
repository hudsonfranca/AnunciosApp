import styled from 'styled-components'
import img from '../../assets/home.jpg'
import { Search } from '@styled-icons/boxicons-regular'

export const Image = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${img});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  object-fit: cover;
  position: relative;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    z-index: -1;
  }
`
export const SearchIcon = styled(Search)`
  color: #f5f5f5;
  width: 20px;
  height: 20px;
`
export const Title = styled.p`
  font-size: 1.8rem;
  color: #f5f5f5;
  z-index: 1;
`
