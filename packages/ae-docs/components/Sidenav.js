import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import Link from './Link';
import { RouterContext } from './Router';


const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  height: 100vh;
  overflow: auto;
  width: 230px;
  background-color: #fff;
  border-right: 1px solid #eee;
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

const Sidenav = ({ pages }) => {
  const [term, setSearchTerm] = useState('');
  const { page: curentPage } = useContext(RouterContext) || {};

  const onSearch = e => setSearchTerm(e.currentTarget.value);

  const isMatch = str => `${str}`.toLowerCase().indexOf(term.toLowerCase()) >= 0;

  return (
    <Wrapper>
      <div style={{ padding: '.5em' }}>
        <SearchInput type='text' value={term} onChange={onSearch} placeholder="Search" />
      </div>

      <div style={{ textAlign: 'center', padding: '1em 0' }}>
        algebraic-effects
      </div>

      <div style={{ paddingTop: '.5em' }}>
        {Object.keys(pages)
          .map(key => ({ ...pages[key], key }))
          .filter(page => {
            return !term ? true : (
              isMatch(page.title) ||
              isMatch(page.key) ||
              isMatch(page.description)
            );
          })
          .sort((a, b) => a.order - b.order)
          .map(page => (
            <Item key={page.key} isCurrentPage={curentPage === page.key}>
              <Link to={page.key}>{page.title}</Link>
            </Item>
          ))}
      </div>
    </Wrapper>
  );
};

export default Sidenav;
