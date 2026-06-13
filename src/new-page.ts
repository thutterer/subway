import { css, html, LitElement } from "lit";
import "./back-link.js";
import "./tile-select.js";
import { type Block, dbCreateDoc } from "./db/db.js";
import type { TileOption } from "./tile-select.js";

const NOTE_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4h-2v6h6V8h2v14H2V2h14v2ZM4 20h16v-8h-8V4H4v16Zm8-2H6v-2h6v2Zm-2-4H6v-2h4v2Zm10-6h-2V6h2v2Zm-2-2h-2V4h2v2Z"/></svg>`;

const LIST_SVG = html`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M10 5h12v2H10zm0 4h8v2h-8zm0 4h12v2H10zm0 4h8v2h-8zM4 7v2h2V7H4Zm4 4H2V5h6v6Zm-6 2h6v2H2zm0 4h6v2H2zm0 0v-2h2v2zm4 0v-2h2v2z"/></svg>`;

const TYPE_OPTIONS: TileOption[] = [
	{ value: "text", label: "Note", icon: NOTE_SVG },
	{ value: "list", label: "List", icon: LIST_SVG },
];

class NewPage extends LitElement {
	static styles = css`
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
  `;

	private async _onTypeChange(e: Event) {
		const type = (e as CustomEvent<{ value: Block["type"] }>).detail.value;
		const id = await dbCreateDoc(type);
		this.dispatchEvent(
			new CustomEvent("navigate", {
				bubbles: true,
				composed: true,
				detail: { path: `note/${id}` },
			}),
		);
	}

	render() {
		return html`
      <div class="header">
        <back-link></back-link>
        <h2>What do you want to create?</h2>
      </div>

      <tile-select
        .options=${TYPE_OPTIONS}
        @tile-select=${this._onTypeChange}
      ></tile-select>
    `;
	}
}

customElements.define("new-page", NewPage);
