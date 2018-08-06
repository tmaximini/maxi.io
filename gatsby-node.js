const path = require('path')

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const postTemplate = path.resolve('src/templates/post.js')
  const travelTemplate = path.resolve('src/templates/travel.js')
  const projectTemplate = path.resolve('src/templates/project.js')

  return graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___order], order: ASC }) {
        edges {
          node {
            html
            id
            frontmatter {
              path
              title
              type
              tech
              summary
              keywords
              image {
                childImageSharp {
                  sizes(maxWidth: 200) {
                    src
                    srcSet
                    sizes
                    base64
                  }
                }
              }
            }
          }
        }
      }
    }
  `).then(res => {
    if (res.errors) {
      return Promise.reject(res.errors)
    }

    const projects = res.data.allMarkdownRemark.edges.filter(
      ({ node }) => node.frontmatter.type === 'project'
    )
    const posts = res.data.allMarkdownRemark.edges.filter(
      ({ node }) => node.frontmatter.type === 'post'
    )
    const travel = res.data.allMarkdownRemark.edges.filter(
      ({ node }) => node.frontmatter.type === 'travel'
    )

    projects.forEach(({ node }, index) => {
      createPage({
        path: node.frontmatter.path,
        component: projectTemplate,
        context: {
          prev: index === 0 ? projects[projects.length - 1].node : projects[index - 1].node,
          next: index === projects.length - 1 ? projects[0].node : projects[index + 1].node
        }
      })
    })

    posts.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: postTemplate
      })
    })

    travel.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: travelTemplate
      })
    })
  })
}
