import React from "react";

import Layout from "../components/Layout";
import Profile from "../components/Profile/Profile";
import Section from "../components/Shared/Section/Section";
import SEO from "../components/seo";

const IndexPage = () => (
  <Layout>
    <SEO title={`Home`} />
    <Section style={{ position: "relative" }}>
      <Profile />
    </Section>
  </Layout>
);

export default IndexPage;
