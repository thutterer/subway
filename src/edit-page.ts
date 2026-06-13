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
		_openInserter: { state: true },
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

    .inserter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }

    .ins-pill {
      opacity: 0.4;
      transition: opacity 0.15s;
      font-size: 0.7rem;
      padding: 1px 8px;
    }
    .inserter:hover .ins-pill {
      opacity: 0.8;
    }

    .ins-expanded {
      display: flex;
      gap: 0.5rem;
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
	private _openInserter: number | null = null;
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
		const { blockIndex, tasks } = (
			e as CustomEvent<{ blockIndex: number; tasks: Task[] }>
		).detail;
		this._blocks = this._blocks.map((b, i) =>
			i === blockIndex ? { ...b, items: tasks } : b,
		);
		await dbUpdateDoc(this.noteId, { blocks: this._blocks });
	}

	private _toggleInserter(position: number) {
		this._openInserter = this._openInserter === position ? null : position;
	}

	private _insertBlock(position: number, type: "text" | "list" | "divider") {
		let block: Block;
		if (type === "list") {
			block = { type: "list", items: [] };
		} else if (type === "divider") {
			block = { type: "divider" };
		} else {
			block = { type: "text", markdown: "" };
		}
		this._blocks = [
			...this._blocks.slice(0, position),
			block,
			...this._blocks.slice(position),
		];
		this._openInserter = null;
		dbUpdateDoc(this.noteId, { blocks: this._blocks });
	}

	private async _deleteBlock(index: number) {
		if (!confirm("Delete this block?")) return;
		this._blocks = this._blocks.filter((_, i) => i !== index);
		await dbUpdateDoc(this.noteId, { blocks: this._blocks });
	}

	private _renderInserter(position: number) {
		const open = this._openInserter === position;
		return html`
			<div class="inserter">
				<div>
					${
						open
							? html`
						<div class="ins-expanded">
							<button class="block-btn" @click=${() => this._insertBlock(position, "text")}>Text</button>
							<button class="block-btn" @click=${() => this._insertBlock(position, "list")}>List</button>
							<button class="block-btn" @click=${() => this._insertBlock(position, "divider")}>---</button>
						</div>
					`
							: html`
						<button class="block-btn ins-pill" @click=${() => this._toggleInserter(position)}>+</button>
					`
					}
				</div>
				${
					position > 0
						? html`
					<button class="block-btn" @click=${() => this._deleteBlock(position - 1)}>-</button>
				`
						: html``
				}
			</div>
		`;
	}

	private _renderBlock(block: Block, i: number) {
		let content = html``;
		if (block.type === "list") {
			content = html`
				<list-item
					.noteId=${this.noteId}
					.blockIndex=${i}
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
		return content;
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
      ${this._blocks.map(
				(block, i) => html`
        ${this._renderInserter(i)}
        ${this._renderBlock(block, i)}
      `,
			)}
      ${this._renderInserter(this._blocks.length)}
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `;
	}
}

customElements.define("edit-page", EditPage);
