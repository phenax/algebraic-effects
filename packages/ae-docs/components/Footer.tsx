import React, { useContext } from 'react';
import styled from 'styled-components';
import Link from './Link';

import { RouterContext } from './Router';
import { Routes } from '../types/routes';
import { findMatchingRoutes } from '../utils/routes';

interface FooterWrapper {
  isPreviousLinkVisible: boolean;
}

const FooterWrapper = styled.div`
  display: flex;
  justify-content: ${(props: FooterWrapper) =>
    props.isPreviousLinkVisible ? 'space-between' : 'flex-end'};
  margin-top: 24px;
`;

const FooterLinkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const FooterLinkText = styled.span`
  vertical-align: center;
`;

interface FooterLinksProps {
  routes: Routes;
}

const FooterLinks = ({ routes }: FooterLinksProps) => {
  const { page: currentPage } = useContext(RouterContext);
  const matchingRoutes = findMatchingRoutes('')(routes);

  const currentPageIndex = matchingRoutes.findIndex(
    (route: { key: string }) => {
      return route.key === currentPage;
    }
  );

  const prevPage = matchingRoutes[currentPageIndex - 1];
  const nextPage = matchingRoutes[currentPageIndex + 1];

  return (
    <FooterWrapper isPreviousLinkVisible={!!prevPage}>
      {prevPage && (
        <FooterLinkWrapper>
          <FooterLinkText>{'< Previous'}</FooterLinkText>
          <Link to={prevPage.key}>{prevPage.title}</Link>
        </FooterLinkWrapper>
      )}
      {nextPage && (
        <FooterLinkWrapper>
          <FooterLinkText>{'Next >'}</FooterLinkText>
          <Link to={nextPage.key}>{nextPage.title}</Link>
        </FooterLinkWrapper>
      )}
    </FooterWrapper>
  );
};

export default FooterLinks;
