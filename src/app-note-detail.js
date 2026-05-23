// ai foo
//

import { LitElement, html, css } from 'lit';
import { db } from './db.js';

export class AppNoteDetail extends LitElement {
  static properties = {
    noteId: { type: String }, // Passed from the router
    note: { type: Object }
  };

  // Triggered automatically whenever properties (like noteId) change
  async willUpdate(changedProperties) {
    if (changedProperties.has('noteId') && this.noteId) {
      const id = parseInt(this.noteId, 10);
      this.note = await db.notes.get(id);
    }
  }

  render() {
    if (!this.note) return html`<p>Loading note...</p>`;

    return html`
      <a href="/">⬅ Back to List</a>
      <div class="note-card">
        <h2>Note Details</h2>
        <p>${this.note.text}</p>
        <small>Created: ${new Date(this.note.created_at).toLocaleString()}</small>
      </div>
    `;
  }
}
customElements.define('app-note-detail', AppNoteDetail);
