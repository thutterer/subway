import { liveQuery } from "dexie";
import { css, html, LitElement } from "lit";
import "./back-link.js";
import "./note-item.js";
import "./list-item.js";
import "./divider-item.js";
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

    .block-wrapper {
      position: relative;
    }

    .block-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.25rem;
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      z-index: 1;
    }

    .block-btn {
      background: none;
      border: 1px solid var(--border-light);
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 0.75rem;
      padding: 2px 6px;
      color: var(--text-muted);
      line-height: 1;
    }
    .block-btn:hover {
      color: var(--text-strong);
      border-color: var(--text-muted);
    }

    .add-bar {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--border-light);
      margin-top: 0.5rem;
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

	private _addBlock(type: "text" | "list" | "divider") {
		let block: Block;
		if (type === "list") {
			block = { type: "list", items: [] };
		} else if (type === "divider") {
			block = { type: "divider" };
		} else {
			block = { type: "text", markdown: "" };
		}
		this._blocks = [...this._blocks, block];
		dbUpdateDoc(this.noteId, { blocks: this._blocks });
	}

	private async _deleteBlock(index: number) {
		if (!confirm("Delete this block?")) return;
		this._blocks = this._blocks.filter((_, i) => i !== index);
		await dbUpdateDoc(this.noteId, { blocks: this._blocks });
	}

	private _renderBlock(block: Block, i: number) {
		let content = html``;
		if (block.type === "list") {
			content = html`
				<list-item
					.noteId=${this.noteId}
					.tasks=${block.items}
					@list-changed=${this._onListChanged}
				></list-item>
			`;
		} else if (block.type === "divider") {
			content = html`<divider-item></divider-item>`;
		} else {
			content = html`
				<note-item
					.blockIndex=${i}
					.text=${block.markdown}
					@block-changed=${this._onBlockChanged}
				></note-item>
			`;
		}
		return html`
			<div class="block-wrapper">
				${content}
				<div class="block-actions">
					<button class="block-btn" @click=${() => this._deleteBlock(i)}>
						[-]
					</button>
				</div>
			</div>
		`;
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
      ${this._blocks.map((block, i) => this._renderBlock(block, i))}
      <div class="add-bar">
        <button class="block-btn" @click=${() => this._addBlock("text")}>+ Text</button>
        <button class="block-btn" @click=${() => this._addBlock("list")}>+ List</button>
        <button class="block-btn" @click=${() => this._addBlock("divider")}>+ ---</button>
      </div>
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `;
	}
}

customElements.define("edit-page", EditPage);
