import { css, html, LitElement } from "lit";

class BackLink extends LitElement {
	static styles = css`
    a {
      text-decoration: none;
      color: var(--text-muted);
      padding: 2px 8px;

      &:hover {
        color: var(--text-strong);
      }
    }
  `;

	#onClick(e: MouseEvent) {
		e.preventDefault();
		this.dispatchEvent(
			new CustomEvent("navigate", {
				bubbles: true,
				composed: true,
				detail: { path: "" },
			}),
		);
	}

	render() {
		return html`<a href="/" @click=${this.#onClick}>&lt;</a>`;
	}
}
customElements.define("back-link", BackLink);
