import React from 'react'
import styled from 'styled-components'
import './index.scss'
export default ({ tag, onClick, selected }) => (
  <div
    className="post_tag"
    onClick={onClick}
    aria-selected={selected ? 'true' : 'false'}
  >
    <Label>{`#${tag}`}</Label>
  </div>
)

const Wrapper = styled.div`
//   background: #f4f7f8;
//   display: inline-block;
//   margin: 3px 5px;
//   color: blue;
//   border-radius: 5px;
//   height: 100%;
//   color: black;
//   box-shadow: 1px 1px 1px 1px gray;
//   box-sizing: border-box;

//   ${props => props.selected && 'border: 1px solid black;font-weight:700;'}
`

const Label = styled.p`
  padding: 0 5px;
  font-size: 0.8rem;
  padding: 2px 15px;
  margin: 0;
`

const Count = styled.p`
  margin: 0;
  width: 20px;
  display: flex;
  justify-content: center;
  padding: 0 3px;
  font-size: 0.8rem;
  border-radius: 10px;
  background: #747474;
`
