import React from 'react'
import styled from 'styled-components'
import Tag from '../../components/tag'

export const TagContainer = ({ tags, tag, selectTag }) => {
  return (
    <Container>
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
  margin: 0px !important;
  box-sizing: border-box;
  padding: 5px 5px;
  white-space: nowrap;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  align-items: center;
`

const Box = styled.p`
  padding: 0 3px;
  background: cyan;
  color: blue;
  margin: 1px 3px;
  border-radius: 3px;
`
