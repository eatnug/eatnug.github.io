import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { TagsLabel } from '../tagsLabel'
import Tag from '../tag'

import './index.scss'

export const PostTitle = ({ title, category, tags, date }) => {
  return (
    <Area>
      <TagsLabel tags={tags} />
      <Title>{title}</Title>
      <Meta>
        <Right>
          <Date>{date}</Date>
          <Category>{category}</Category>
        </Right>
      </Meta>
    </Area>
  )
}

const Area = styled.div`
  padding: 3% 3%;
  p {
    margin-bottom: 0;
  }
`

const Title = styled.p`
  font-size: 2rem;
  font-weight: 900;
  margin-top: 2%;
`
const Meta = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3%;
`
const Right = styled.div`
  font-style: italic;
  color: grey;
  font-size: 1rem;
`
const Date = styled.div``
const Category = styled.div`
  text-align: right;
`
const Label = styled.p`
  padding: 0 5px;
  font-size: 0.8rem;
  padding: 2px 15px;
  margin: 0;
`
