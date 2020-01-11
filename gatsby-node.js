const path = require("path");

const sharp = require("sharp");

// https://github.com/gatsbyjs/gatsby/issues/6291
sharp.simd(false);
sharp.cache(false);

const wrapper = promise =>
  promise.then(result => {
    if (result.errors) {
      throw result.errors;
    }
    return result;
  });

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve("src/templates/post.js");
  // const travelTemplate = path.resolve("src/templates/travel.js");
  const projectTemplate = path.resolve("src/templates/project.js");

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
  `);

  const projects = allMarkdown.data.allMarkdownRemark.edges.filter(
    ({ node }) => node.frontmatter.type === "project"
  );
  const posts = allMarkdown.data.allMarkdownRemark.edges.filter(
    ({ node }) => node.frontmatter.type === "post"
  );

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
};
