import { LitElement, html } from 'lit';
import './my-button.js';
import './note-item.js';
import { dbFetchNoteById } from './db/db.js';

class EditPage extends LitElement {
  static properties = {
    noteId: { type: Number },
    text: { type: String },
    type: { type: String },
  };

  noteId!: number;
  type = '';
  text = '';
  created_at = 0;

  private async _fetchRecord(id: number) {
    const note = await dbFetchNoteById(id);
    if (note) {
      this.text = note.text;
      this.type = note.type ?? '';
      this.created_at = note.created_at;
    }
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('noteId')) {
      this._fetchRecord(this.noteId);
    }
  }

  render() {
    return html`
      <h2>Edit ${this.type}</h2>

      <note-item
        .noteId=${this.noteId}
        .text=${this.text}
        .created_at=${this.created_at}
      ></note-item>
    `
  }
}

customElements.define('edit-page', EditPage);
