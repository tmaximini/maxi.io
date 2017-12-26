const path = require('path')

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const postTemplate = path.resolve('src/templates/post.js')
  const projectTemplate = path.resolve('src/templates/project.js')

  return graphql(`
    {
      allMarkdownRemark {
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
              image {
                childImageSharp {
                  resize(width: 250) {
                    src
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
  })
}
