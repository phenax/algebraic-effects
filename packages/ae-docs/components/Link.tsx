import React from 'react';

interface LinkProps {
  to: string,
  isExternal?: boolean,
  children?: string | JSX.Element[] | JSX.Element,
};

const Link = ({ to, isExternal = false, ...props }: LinkProps): JSX.Element =>
  !isExternal
    ? <a href={`#${to}`} {...props} />
    : <a href={to} target="_blank" rel="noopener noreferrer" {...props} />;

export default Link;
