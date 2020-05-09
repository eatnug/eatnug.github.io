import React from 'react'
import styled from 'styled-components'
import Tag from '../../components/tag'

export const TagContainer = ({ tags, tag, selectTag }) => {
  return (
    <Container
    className="tagContainer"
    >
      <Tag
        tag={'all'}
        onClick={() => selectTag('all')}
        selected={tag === 'all'}
      />
      {tags?.map((_tag, index) => (
        <Tag
          key={index}
          tag={_tag}
          onClick={() => selectTag(_tag)}
          selected={tag === _tag}
        />
      ))}
    </Container>
  )
}

const Container = styled.ul`

`

const Box = styled.p`
  padding: 0 3px;
  background: cyan;
  color: blue;
  margin: 1px 3px;
  border-radius: 3px;
`
