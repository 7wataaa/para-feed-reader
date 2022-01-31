import { styled } from 'linaria/lib/react';

const LoadingTypographyAnim = styled.div`
  span {
    display: inline-block;
    margin: 0 -0.05rem;
    font-weight: lighter;
    font-size: 4rem;
    animation: loading 1.5s infinite;
  }
  span:nth-child(2) {
    animation-delay: 0.1s;
  }
  span:nth-child(3) {
    animation-delay: 0.2s;
  }
  span:nth-child(4) {
    animation-delay: 0.3s;
  }
  span:nth-child(5) {
    animation-delay: 0.4s;
  }
  span:nth-child(6) {
    animation-delay: 0.5s;
  }
  span:nth-child(7) {
    animation-delay: 0.6s;
  }
  span:nth-child(8) {
    animation-delay: 0.7s;
  }

  @keyframes loading {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(5px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const LoadingTypography = () => {
  return (
    <LoadingTypographyAnim>
      <span>L</span>
      <span>o</span>
      <span>a</span>
      <span>d</span>
      <span>i</span>
      <span>n</span>
      <span>g</span>
      <span>…</span>
    </LoadingTypographyAnim>
  );
};

export { LoadingTypography };
