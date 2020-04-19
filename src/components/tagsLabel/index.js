import React from 'react'

import styled from 'styled-components'
import { navigate } from '@reach/router'
import Tag from '../tag'

export const TagsLabel = ({ tags }) => {
  const onClick = tag => {
    navigate('/', { state: { tag } })
  }
  return (
    <Container>
      {tags?.map((tag, index) => (
        <Tag tag={tag} key={index} onClick={() => onClick(tag)} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > div {
    margin-left: 0;
    margin-right: 2%;
  }
`

const Box = styled.p`
  padding: 0 3px;
  background: cyan;
  color: blue;
  margin: 1px 3px;
  border-radius: 3px;
`
