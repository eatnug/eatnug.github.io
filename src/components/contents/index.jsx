import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'

export const Contents = ({
  posts,
  countOfInitialPost,
  count,
  category,
  tag,
}) => {
  const refinedPosts = useMemo(() =>
    posts
      .filter(
        ({ node }) =>
          category === CATEGORY_TYPE.ALL ||
          node.frontmatter.category === category
      )
      .filter(
        ({ node }) =>
          tag === 'all' ||
          (node.frontmatter.tags && node.frontmatter.tags.includes(tag))
      )
      .slice(0, count * countOfInitialPost)
  )

  return (
    <ThumbnailContainer>
      {refinedPosts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  )
}
