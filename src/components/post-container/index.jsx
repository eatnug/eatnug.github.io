import React from 'react'
import styled from 'styled-components'

const Content = styled.div`
  padding: 3%;
  font-size: 0.85rem;
`

export const PostContainer = ({ html }) => (
  <Content dangerouslySetInnerHTML={{ __html: html }} />
)
