import React from 'react';

export default ({ to, isExternal = false, ...props }) =>
  !isExternal
    ? <a href={`#${to}`} {...props} />
    : <a href={to} target="_blank" rel="noopener" {...props} />;
