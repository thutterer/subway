import { LitElement, html, css } from 'lit';
import type { Note } from './db/db.js';
import './note-item.js';

class NoteList extends LitElement {
  static properties = {
    notes: { type: Array }
  };

  static styles = css`
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
    .empty-state {
      color: #666;
      font-style: italic;
    }
  `;

  notes: Note[] = [];

  render() {
    return html`
      <div class="list-container">
        ${this.notes.map(note => html`
          <note-item
            .noteId=${note.id}
            .text=${note.text}
            .created_at=${note.created_at}>
          </note-item>
        `)}

        ${this.notes.length === 0 ? html`
          <p class="empty-state">No notes found. Tap "+ New Note" to start writing!</p>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('note-list', NoteList);
