import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import Link from './Link';
import { RouterContext } from './Router';


const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 230px;
  background-color: #fff;
  border-right: 1px solid #eee;
  font-size: 1em;

  @media all and (max-width: 1100px) {
    transition: transform .3s ease-in-out;
    transform: translateX(${p => p.isVisible ? '0px' : '-100%'});
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
  font-size: .8em;
  padding: .6em .7em;
  cursor: pointer;

  .bar {
    width: 1.7em;
    height: 3px;
    background-color: #fff;
    margin: .3em;
  }

  display: none;

  @media all and (max-width: 1100px) {
    display: block;
  }
`;

const Item = styled.div`
  border-right: ${p => p.isCurrentPage ? '3px solid #666' : 'none'};
  background-color: ${p => p.isCurrentPage ? '#f1f1f1' : 'transparent'};

  font-size: .8em;

  &:hover {
    background-color: #f6f6f6;
  }

  a {
    text-decoration: none;
    display: block;
    width: 100%;
    padding: .7em .9em;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: none;
  border-bottom: 1px solid #ccc;
  display: block;
  width: 100%;
  padding: .5em;
`;

const Sidenav = ({ routes }) => {
  const [term, setSearchTerm] = useState('');
  const [isVisible, setNavVisibility] = useState(false);
  const { page: curentPage } = useContext(RouterContext) || {};

  const onSearch = e => setSearchTerm(e.currentTarget.value);

  const isMatch = str => `${str}`.toLowerCase().indexOf(term.toLowerCase()) >= 0;

  return (
    <Wrapper isVisible={isVisible}>
      <NavBtn onClick={() => setNavVisibility(!isVisible)}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </NavBtn>
      <div style={{ height: '100vh', overflow: 'auto' }}>
        <div style={{ padding: '.5em' }}>
          <SearchInput type='text' value={term} onChange={onSearch} placeholder="Search" />
        </div>

        <div style={{ textAlign: 'center', padding: '1em 0' }}>
          algebraic-effects
        </div>

        <div style={{ paddingTop: '.5em' }}>
          {Object.keys(routes)
            .map(key => ({ ...routes[key], key }))
            .filter(page => {
              return !term ? true : (
                isMatch(page.title) ||
                isMatch(page.key) ||
                isMatch(page.description)
              );
            })
            .sort((a, b) => a.order - b.order)
            .map(page => (
              <Item
                key={page.key}
                isCurrentPage={curentPage === page.key}
                onClick={() => setNavVisibility(false)}
              >
                <Link to={page.key}>{page.title}</Link>
              </Item>
            ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Sidenav;
