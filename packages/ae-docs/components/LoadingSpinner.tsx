import React from 'react';
import styled, { keyframes } from 'styled-components';


export const spinAnimation = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

interface CenteredWrapperProps { height?: number };
const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(p: CenteredWrapperProps) => p.height || '300px'};
`;

interface SpinnerProps {
  isVisible?: boolean,
  size?: number,
  color?: string,
  thickness?: number,
};
export const Spinner = styled.div`
  display: ${(p: SpinnerProps) => p.isVisible ? 'block': 'none'};
  width: ${(p: SpinnerProps) => p.size || 70}px;
  height: ${(p: SpinnerProps) => p.size || 70}px;
  border: ${(p: SpinnerProps) => p.thickness || 3}px solid transparent;
  border-left-color: ${(p: SpinnerProps) => p.color || '#333'};
  border-right-color: ${(p: SpinnerProps) => p.color || '#333'};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

interface LoadingSpinnerProps { height?: number };
const LoadingSpinner = ({ height, ...props }: LoadingSpinnerProps) => (
  <CenteredWrapper height={height}>
    <Spinner isVisible {...props} />
  </CenteredWrapper>
);

export default LoadingSpinner;
