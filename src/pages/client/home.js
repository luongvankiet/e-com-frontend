import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PROJECT_NAME } from 'src/config-global';
import { HomeView } from 'src/sections/home';

const Home = () => (
  <>
    <Helmet>
      <title>{PROJECT_NAME}</title>
    </Helmet>

    <HomeView />
  </>
);

export default Home;
