import { LitElement, html, css } from 'lit';
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

  constructor() {
    super();
    this.notes = [];
  }

  render() {
    return html`
      <div class="list-container">
        ${this.notes.map(note => html`
          <note-item
            .id=${note.id}
            .text=${note.text}>
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
