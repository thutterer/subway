import { LitElement, html, css } from 'lit';
import { dbFetchAll, dbCreateNote, dbUpdateNote } from './db/db.js';

// Import child presentation components
import './note-list.js';

class AppRoot extends LitElement {
  static properties = {
    notes: { type: Array }
  };

  constructor() {
    super();
    this.notes = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.refreshNotes();
  }

  async refreshNotes() {
    this.notes = await dbFetchAll();
  }

  async handleCreate() {
    await dbCreateNote();
    await this.refreshNotes();
  }

  async handleNoteUpdate(e) {
    const { id, text } = e.detail;
    await dbUpdateNote(id, text);
    await this.refreshNotes();
  }

  render() {
    return html`
      <header>
        <h1>Subway Notes</h1>
        <button @click=${this.handleCreate}>+ New Note</button>
      </header>

      <note-list
        .notes=${this.notes}
        @note-changed=${this.handleNoteUpdate}>
      </note-list>
    `;
  }
}
customElements.define('app-root', AppRoot);
