import { css, html, LitElement } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { highlightMarkdown } from "./markdown-highlight.js";

class NoteItem extends LitElement {
	static properties = {
		blockIndex: {},
		text: { type: String },
	};

	static styles = css`
    .editor-wrapper {
      display: grid;
      border: 1px solid var(--border-light);
      min-height: 80vh;
    }
    .editor-wrapper > * {
      grid-area: 1 / 1 / 2 / 2;
    }
    .backdrop {
      pointer-events: none;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      margin: 0;
      padding: 4px;
      font-family: inherit;
      font-size: 1rem;
      line-height: inherit;
      tab-size: 2;
      color: var(--text-strong);
    }
    textarea {
      background: transparent;
      border: none;
      resize: none;
      overflow: hidden;
      font-family: inherit;
      font-size: 1rem;
      line-height: inherit;
      padding: 4px;
      tab-size: 2;
      color: transparent;
      caret-color: var(--text-strong);
      -webkit-text-fill-color: transparent;
      outline: none;
    }
    textarea::placeholder {
      color: var(--text-muted);
      -webkit-text-fill-color: var(--text-muted);
    }

    .md-h1 { color: #e8c547; }
    .md-h2 { color: #d4a843; }
    .md-h3 { color: #c08a3f; }
    .md-h4, .md-h5, .md-h6 { color: #ac6c3c; }
    .md-bold { color: var(--text-strong); }
    .md-italic { color: #8ab4f8; }
    .md-strike {
      color: var(--text-muted);
      text-decoration: line-through;
    }
    .md-code {
      background: rgba(128, 128, 128, 0.15);
      color: #e06c75;
      border-radius: 3px;
    }
    .md-link { color: var(--brand-color); }
    .md-image { color: var(--brand-color); }
    .md-blockquote { color: var(--text-subtle); }
    .md-list { color: #56b6c2; }
    .md-hr { color: var(--text-muted); }
    .md-fence {
      background: rgba(128, 128, 128, 0.15);
      color: #e06c75;
    }
  `;

	blockIndex!: number;
	text!: string;

	private _onInput(e: Event) {
		const markdown = (e.target as HTMLTextAreaElement).value;
		this.dispatchEvent(
			new CustomEvent("block-changed", {
				bubbles: true,
				composed: true,
				detail: { blockIndex: this.blockIndex, markdown },
			}),
		);
	}

	render() {
		return html`
      <div class="editor-wrapper">
        <div class="backdrop" aria-hidden="true">${unsafeHTML(highlightMarkdown(this.text))}</div>
        <textarea
          .value=${this.text}
          @input=${this._onInput}
          placeholder="Start typing...">
        </textarea>
      </div>
    `;
	}
}
customElements.define("note-item", NoteItem);
