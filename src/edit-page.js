import { LitElement, html, css } from 'lit';
import './my-button.js';
import './note-item.js';
import { dbFetchNoteById, dbDeleteNote, dbUpdateNote } from './db/db.js';

class EditPage extends LitElement {
  static properties = {
    id: { type: Number },
    text: { type: String },
    type: { type: String },
};

  constructor() {
    super();
    this.id = null;
    this.type = null;
    this.text = '';
    this.created_at = 0;
  }

  async _fetchRecord(id) {
    const flup = await dbFetchNoteById(id);
    if (flup) {
      this.text = flup.text;
      this.type = flup.type;
      this.created_at = flup.created_at;
    }
  }

  async willUpdate(changedProperties) {
    if (changedProperties.has('id')) {
      this._fetchRecord(this.id);
    }
  }

  render() {
    return html`
      <h2>Edit ${this.type}</h2>

      <note-item
        .id=${this.id}
        .text=${this.text}
        .created_at=${this.created_at}
      ></note-item>
    `
  }
}

customElements.define('edit-page', EditPage);
