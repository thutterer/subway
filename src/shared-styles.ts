import { css } from 'lit';

export const globalStyles = css`
  a {
    text-decoration: none;
    color: var(--brand-color);
    transition: color 0.15s ease-in-out;
  }

  a:hover {
    color: color-mix(in srgb, var(--brand-color), #fff 15%);
  }
`;
