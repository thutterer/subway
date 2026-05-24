import { LitElement, html, css } from 'lit';
import type { Note } from './db/db.js';

const formatTimestamp = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  });

class NoteList extends LitElement {
  static properties = {
    notes: { type: Array }
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
      background: rgba(0,0,0,0.03);
    }

    .text {
      flex: 1 1 100%;
      font-family: "Silkscreen", monospace;
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
    }
  `;

  notes: Note[] = [];

  render() {
    if (this.notes.length === 0) {
      return html`<p class="empty">No notes yet.</p>`;
    }

    return html`
      <div class="list" role="list">
        ${this.notes.map(note => html`
          <a class="row" role="listitem" href="/note/${note.id}">
            <span class="text">${note.text || 'Untitled'}</span>
            <span class="date">${formatTimestamp(note.created_at)}</span>
            <span class="type">${note.type || 'Note'}</span>
          </a>
        `)}
      </div>
    `;
  }
}
customElements.define('note-list', NoteList);
