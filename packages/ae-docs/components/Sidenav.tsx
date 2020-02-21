import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { compose, groupBy, propOr } from 'ramda';
import { fromClassPrototype } from 'pipey';

import { Routes, Page } from '../types/routes';
import { findMatchingRoutes } from '../utils/routes';

import Link from './Link';
import { RouterContext } from './Router';

const MOBILE_BREAKPOINT = 'max-width: 1100px';

interface WrapperProps {
  isVisible: boolean;
}
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #eee;
  font-size: 1em;

  @media all and (${MOBILE_BREAKPOINT}) {
    transition: transform 0.3s ease-in-out;
    transform: translateX(
      ${(p: WrapperProps) => (p.isVisible ? '0px' : '-100%')}
    );
    width: 300px;
    font-size: 1.3em;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.05);
  }
`;

const NavBtn = styled.button`
  position: absolute;
  left: 100%;
  top: 0;
  outline: none;
  border: none;
  background-color: #222;
  font-size: 0.8em;
  padding: 0.6em 0.7em;
  cursor: pointer;

  .bar {
    width: 1.7em;
    height: 3px;
    background-color: #fff;
    margin: 0.3em;
  }

  display: none;

  @media all and (${MOBILE_BREAKPOINT}) {
    display: block;
  }
`;

interface ItemProps {
  isCurrentPage: boolean;
}
const Item = styled.div`
  border-right: ${(p: ItemProps) =>
    p.isCurrentPage ? '3px solid #666' : 'none'};
  background-color: ${(p: ItemProps) =>
    p.isCurrentPage ? '#f1f1f1' : 'transparent'};

  font-size: 0.8em;

  &:hover {
    background-color: #f6f6f6;
  }

  a {
    text-decoration: none;
    display: block;
    width: 100%;
    padding: 0.7em 0.9em;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: none;
  border-bottom: 1px solid #ccc;
  display: block;
  width: 100%;
  padding: 0.5em;
`;

const GroupName = styled.div`
  color: #888;
  text-transform: uppercase;
  font-size: 0.7em;
  border-bottom: 1px solid #f3f3f3;
  padding: 1.5em 1em 0;
`;

const SidebarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
`;

const IconLink = styled(Link)`
  font-size: 0.8em;
`;

const { map } = fromClassPrototype(Array);

interface SidenavProps {
  routes: Routes;
}
const Sidenav = ({ routes }: SidenavProps) => {
  const [term, setSearchTerm] = useState('');
  const [isVisible, setNavVisibility] = useState(false);
  const { page: curentPage } = useContext(RouterContext);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.currentTarget.value);

  return (
    <Wrapper isVisible={isVisible}>
      <NavBtn onClick={() => setNavVisibility(!isVisible)}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </NavBtn>
      <SidebarContainer>
        <div>
          <div style={{ padding: '.5em' }}>
            <SearchInput
              type="text"
              value={term}
              onChange={onSearch}
              placeholder="Search"
            />
          </div>

          <div style={{ textAlign: 'center', padding: '1em 0' }}>
            algebraic-effects
            <div>
              <IconLink
                to="https://github.com/phenax/algebraic-effects"
                isExternal
              >
                View on Github
              </IconLink>
            </div>
          </div>

          <div style={{ paddingTop: '.5em' }}>
            {compose(
              map(({ group, items }: { group: string; items: Page[] }) => (
                <div key={group}>
                  {group && <GroupName>{group}</GroupName>}
                  {items.map(page => (
                    <Item
                      key={page.key}
                      isCurrentPage={curentPage === page.key}
                      onClick={() => setNavVisibility(false)}
                    >
                      <Link to={page.key || ''}>{page.title}</Link>
                    </Item>
                  ))}
                </div>
              )),
              (o: { [key: string]: Page[] }) =>
                Object.keys(o).map(group => ({ group, items: o[group] })),
              groupBy(propOr('', 'group')),
              findMatchingRoutes(term)
            )(routes)}
          </div>
        </div>
      </SidebarContainer>
    </Wrapper>
  );
};

export default Sidenav;
