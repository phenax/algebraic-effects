import React from 'react';

const Link = ({ to, isExternal = false, ...props }) =>
  !isExternal
    ? <a href={`#${to}`} {...props} />
    : <a href={to} target="_blank" rel="noopener noreferrer" {...props} />;

export default Link;
