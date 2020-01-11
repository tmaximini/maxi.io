const config = require("./config");

const pathPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix;

module.exports = {
  siteMetadata: {
    siteUrl: config.siteUrl + pathPrefix,
    pathPrefix,
    title: config.siteTitle,
    titleAlt: config.siteTitleAlt,
    description: config.siteDescription,
    keywords: config.keywords,
    logo: config.siteLogo,
    headline: config.siteHeadline,
    siteLanguage: config.siteLanguage,
    ogLanguage: config.ogLanguage,
    author: config.author,
    twitter: config.userTwitter,
    facebook: config.ogSiteName
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: config.googleAnalyticsID,
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // enable ip anonymization
        anonymize: true,
        cookieDomain: "thomasmaximini.com"
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-remark-copy-linked-files`,
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: "posts"
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-prismjs`,

          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1120,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    "gatsby-plugin-styled-components",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `tomato`,
        // Disable the loading spinner.
        showSpinner: false
      }
    },
    {
      resolve: `gatsby-remark-images`,
      options: {
        // It's important to specify the maxWidth (in pixels) of
        // the content container as this plugin uses this as the
        // base for generating different widths of each image.
        maxWidth: 500,
        // Remove the default behavior of adding a link to each
        // image.
        linkImagesToOriginal: false,
        // Analyze images' pixel density to make decisions about
        // target image size. This is what GitHub is doing when
        // embedding images in tickets. This is a useful setting
        // for documentation pages with a lot of screenshots.
        // It can have unintended side effects on high pixel
        // density artworks.
        //
        // Example: A screenshot made on a retina screen with a
        // resolution of 144 (e.g. Macbook) and a width of 100px,
        // will be rendered at 50px.
        //
        // Defaults to false.
        sizeByPixelDensity: false
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `thomas-maximini-com`,
        short_name: `tmaximini`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/logo.png` // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-sitemap",
    "gatsby-plugin-netlify-cache"
  ]
};
