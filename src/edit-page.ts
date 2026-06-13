import { liveQuery } from "dexie";
import { css, html, LitElement } from "lit";
import "./back-link.js";
import "./note-item.js";
import "./list-item.js";
import {
	type Block,
	db,
	dbDeleteDoc,
	dbUpdateDoc,
	type Task,
} from "./db/db.js";

class EditPage extends LitElement {
	static properties = {
		noteId: {},
		title: { type: String },
		_blocks: { state: true },
		_editing: { state: true },
	};

	static styles = css`
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .title-text {
      font-family: "Silkscreen", monospace;
      font-size: 1.5rem;
    }
    .title-input {
      flex: 1;
      font-family: "Silkscreen", monospace;
      font-size: 1.5rem;
      padding: 0;
      border: 1px solid var(--brand-color, wheat);
      background: transparent;
    }
    .title-input:focus {
      outline: none;
    }
    .edit-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .edit-btn:hover {
      color: var(--text-strong);
    }

    .footer {
      display: flex;
      justify-content: center;

      .delete {
        margin-top: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-family: "Silkscreen", monospace;
        font-size: 0.75rem;
        color: var(--text-muted);

        &:hover {
          color: var(--text-strong);
        }
      }
    }
  `;

	noteId = "";
	title = "";
	private _blocks: Block[] = [];
	private _editing = false;
	private _sub?: { unsubscribe: () => void };

	connectedCallback() {
		super.connectedCallback();
		if (this.noteId) this._subscribe(this.noteId);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._sub?.unsubscribe();
	}

	private _subscribe(id: string) {
		this._sub?.unsubscribe();
		this._sub = liveQuery(() => db.docs.get(id)).subscribe({
			next: (doc) => {
				if (!doc) return;
				this.title = doc.title ?? "";
				this._blocks = doc.blocks;
			},
		});
	}

	willUpdate(changedProperties: Map<string, unknown>) {
		if (changedProperties.has("noteId")) {
			this._subscribe(this.noteId);
		}
	}

	private async _delete() {
		if (!confirm("Delete this note?")) return;
		await dbDeleteDoc(this.noteId);
		this.dispatchEvent(
			new CustomEvent("navigate", {
				bubbles: true,
				composed: true,
				detail: { path: "" },
			}),
		);
	}

	private _startEdit() {
		this._editing = true;
		this.updateComplete.then(() => {
			const input =
				this.renderRoot.querySelector<HTMLInputElement>(".title-input");
			input?.focus();
		});
	}

	private async _save(e: Event) {
		const input = e.target as HTMLInputElement;
		this.title = input.value;
		this._editing = false;
		await dbUpdateDoc(this.noteId, { title: this.title });
	}

	private _onKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === "Escape") {
			(e.target as HTMLInputElement).blur();
		}
	}

	private _onBlockChanged(e: Event) {
		const { blockIndex, markdown } = (e as CustomEvent).detail;
		const blocks = this._blocks.map((b, i) =>
			i === blockIndex ? { ...b, markdown } : b,
		);
		dbUpdateDoc(this.noteId, { blocks });
	}

	private async _onListChanged(e: Event) {
		const { tasks } = (e as CustomEvent<{ tasks: Task[] }>).detail;
		this._blocks = this._blocks.map((b) =>
			b.type === "list" ? { ...b, items: tasks } : b,
		);
		await dbUpdateDoc(this.noteId, { blocks: this._blocks });
	}

	render() {
		return html`
      <div class="header">
        <back-link></back-link>
        ${
					this._editing
						? html`<input class="title-input" .value=${this.title} @blur=${this._save} @keydown=${this._onKeyDown} />`
						: html`<span class="title-text">${this.title || "Untitled"}</span><button class="edit-btn" @click=${this._startEdit}>edit</button>`
				}
      </div>
      ${this._blocks.map((block, i) =>
				block.type === "list"
					? html`
                <list-item
                  .noteId=${this.noteId}
                  .tasks=${block.items}
                  @list-changed=${this._onListChanged}
                ></list-item>
              `
					: html`
                <note-item
                  .blockIndex=${i}
                  .text=${block.markdown}
                  @block-changed=${this._onBlockChanged}
                ></note-item>
              `,
			)}
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `;
	}
}

customElements.define("edit-page", EditPage);
