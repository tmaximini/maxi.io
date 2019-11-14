const path = require("path");

const wrapper = promise =>
  promise.then(result => {
    if (result.errors) {
      throw result.errors
    }
    return result
  })

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve("src/templates/post.js");
  // const travelTemplate = path.resolve("src/templates/travel.js");
  const projectTemplate = path.resolve("src/templates/project.js");

  const photosTemplate = require.resolve("./src/templates/photos.js")

  const allMarkdown = await graphql(`
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
                  fluid(maxWidth: 200) {
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
  `)

  const allTravel = await wrapper(
    graphql(`
      {
        photos: allTravelYaml {
          nodes {
            slug
            images
          }
        }
      }
    `)
  )

  const projects = allMarkdown.data.allMarkdownRemark.edges.filter(
    ({ node }) => node.frontmatter.type === "project"
  );
  const posts = allMarkdown.data.allMarkdownRemark.edges.filter(
    ({ node }) => node.frontmatter.type === "post"
  );
  // const travel = allMarkdown.data.allMarkdownRemark.edges.filter(
  //   ({ node }) => node.frontmatter.type === "travel"
  // );

  projects.forEach(({ node }, index) => {
    createPage({
      path: node.frontmatter.path,
      component: projectTemplate,
      context: {
        prev:
          index === 0
            ? projects[projects.length - 1].node
            : projects[index - 1].node,
        next:
          index === projects.length - 1
            ? projects[0].node
            : projects[index + 1].node
      }
    });
  });

  posts.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: postTemplate
    });
  });

  console.info({ allTravel})

  allTravel.data.photos.nodes.forEach(node => {
    createPage({
      path: node.slug,
      component: photosTemplate,
      context: {
        slug: node.slug,
        images: `/${node.images}/`,
      },
    })
  })

  // travel.forEach(({ node }) => {
  //   createPage({
  //     path: node.frontmatter.path,
  //     component: travelTemplate
  //   });
  // });
};
