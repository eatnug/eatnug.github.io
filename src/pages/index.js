import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'
import styled from 'styled-components'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { Category } from '../components/category'
import { Tag } from '../components/tags'
import { Contents } from '../components/contents'
import { TagContainer } from '../components/tagContainer'
import * as ScrollManager from '../utils/scroll'
import * as Storage from '../utils/storage'
import * as IOManager from '../utils/visible'
import * as EventManager from '../utils/event-manager'
import * as Dom from '../utils/dom'

import { HOME_TITLE, CATEGORY_TYPE } from '../constants'

const DEST_POS = 325
const BASE_LINE = 80

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos
}

export default ({ data, location }) => {
  const initialCount = Storage.getCount(1)
  const initialCategory = Storage.getCategory(CATEGORY_TYPE.ALL)
  const [count, setCount] = useState(initialCount)
  const countRef = useRef(count)
  const [category, setCategory] = useState(initialCategory)
  const [tag, setTag] = useState(location.state?.tag || 'all')
  const { siteMetadata } = data.site
  const { countOfInitialPost } = siteMetadata.configs
  const posts = data.allMarkdownRemark.edges
  const categories = _.uniq(posts.map(({ node }) => node.frontmatter.category))
  const tags = posts
    .filter(
      post =>
        category === CATEGORY_TYPE.ALL ||
        post.node.frontmatter.category === category
    )
    .map(node => node.node.frontmatter.tags)
    .filter(tags => tags)
    .reduce((acc, cur) => {
      cur.forEach(tag => {
        if (acc[tag]) acc[tag] += 1
        else acc[tag] = 1
      })
      return acc
    }, {})
  useEffect(() => {
    window.addEventListener(`scroll`, onScroll, { passive: false })
    IOManager.init()
    ScrollManager.init()
    if (window.history.state?.tag) window.history.pushState(undefined, 'tag')

    return () => {
      window.removeEventListener(`scroll`, onScroll, { passive: false })
      IOManager.destroy()
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    countRef.current = count
    IOManager.refreshObserver()
    Storage.setCount(count)
    Storage.setCategory(category)
  })

  const selectCategory = category => {
    setTag('all')
    setCategory(category)
    ScrollManager.go(DEST_POS)
  }
  const selectTag = tag => {
    setTag(tag)
    ScrollManager.go(DEST_POS)
  }

  const onScroll = () => {
    const currentPos = window.scrollY + window.innerHeight
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost

    return EventManager.toFit(() => setCount(prev => prev + 1), {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })()
  }

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Bio />
      <Sticky>
        <Category
          categories={categories}
          category={category}
          selectCategory={selectCategory}
        />
        <TagContainer
          tags={Object.keys(tags)}
          tag={tag}
          selectTag={selectTag}
        />
      </Sticky>
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        count={count}
        category={category}
        tag={tag}
      />
    </Layout>
  )
}

const Sticky = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
`

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
            tags
          }
        }
      }
    }
  }
`
