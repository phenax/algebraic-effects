import React from 'react';
import styled from 'styled-components';

import Link from './Link';

const Item = styled.div`
  padding: .5em .2em;
`;

const Sidenav = ({ pages }) => (
  <div>
    {Object.keys(pages).map(page => (
      <Item key={page}>
        <Link to={page}>{pages[page].title}</Link>
      </Item>
    ))}
  </div>
);

export default Sidenav;
