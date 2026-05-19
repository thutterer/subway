import { LitElement, html, css } from 'lit';
import { dbFetchAll, dbCreateNote, dbDeleteNote, dbUpdateNote } from './db/db.js';

import './note-list.js';
import './my-button.js';

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

  async handleNoteDelete(e) {
    const { id } = e.detail;
    await dbDeleteNote(id);
    await this.refreshNotes();
  }

  render() {
    return html`
      <header>
        <h1>Subway Notes</h1>
        <my-button @click=${this.handleCreate}>+ New Note</my-button>
      </header>

      <note-list
        .notes=${this.notes}
        @note-changed=${this.handleNoteUpdate}
        @note-delete=${this.handleNoteDelete}
      >
      </note-list>
    `;
  }
}
customElements.define('app-root', AppRoot);
