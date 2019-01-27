import React from 'react';

export default ({ to, ...props }) => <a href={`#${to}`} {...props} />;
