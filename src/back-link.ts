import { LitElement, html, css } from 'lit';

class BackLink extends LitElement {
  static properties = {
    href: { type: String }
  };

  static styles = css`
    a {
      text-decoration: none;
      color: var(--text-muted);
    }
    a:hover {
      color: var(--text-strong);
    }
  `;

  href = import.meta.env.BASE_URL;

  render() {
    return html`<a href=${this.href}>&lt;</a>`;
  }
}
customElements.define('back-link', BackLink);
