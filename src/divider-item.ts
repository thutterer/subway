import { css, html, LitElement } from "lit";

class DividerItem extends LitElement {
	static styles = css`
    :host {
      display: block;
      padding: 1rem 0;
    }
    hr {
      border: none;
      border-top: 2px dashed var(--border-light);
      margin: 0;
    }
  `;

	render() {
		return html`<hr>`;
	}
}
customElements.define("divider-item", DividerItem);
