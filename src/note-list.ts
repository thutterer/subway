import { css, html, LitElement } from "lit";
import type { Doc } from "./db/db.js";

const base = import.meta.env.BASE_URL;

const formatTimestamp = (ts: number) =>
	new Date(ts).toLocaleString(undefined, {
		dateStyle: "short",
		timeStyle: "short",
	});

const displayType = (doc: Doc) =>
	doc.blocks[0]?.type === "list" ? "List" : "Note";

class NoteList extends LitElement {
	static properties = {
		notes: { type: Array },
	};

	static styles = css`
    .list {
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.25rem 0.5rem;
      padding: 0.625rem 0.5rem;
      text-decoration: none;
      color: inherit;
      border-bottom: 1px solid var(--border);
    }
    .row:last-child {
      border-bottom: none;
    }
    .row:hover {
      background: rgba(128,128,128,0.12);
    }

    .text {
      font-family: "Silkscreen", monospace;
      flex: 1 1 100%;
      font-size: 1rem;
    }

    .date, .type {
      font-family: "Silkscreen", monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .empty {
      padding: 1rem 0;
      color: var(--text-subtle);
      font-style: italic;
      text-align: center;
    }
  `;

	notes: Doc[] = [];

	render() {
		if (this.notes.length === 0) {
			return html`<p class="empty">No notes yet.</p>`;
		}

		return html`
      <div class="list" role="list">
        ${this.notes.map(
					(note) => html`
          <a class="row" role="listitem" href="${base}note/${note.id}" @click=${(
						e: MouseEvent,
					) => {
						e.preventDefault();
						const path = "note/" + note.id;
						this.dispatchEvent(
							new CustomEvent("navigate", {
								bubbles: true,
								composed: true,
								detail: { path },
							}),
						);
					}}>
            <span class="text">${note.title || "Untitled"}</span>
            <span class="date">${formatTimestamp(note.created_at)}</span>
            <span class="type">${displayType(note)}</span>
          </a>
        `,
				)}
      </div>
    `;
	}
}
customElements.define("note-list", NoteList);
