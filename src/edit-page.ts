import { LitElement, html } from 'lit';
import './my-button.js';
import './note-item.js';
import './list-item.js';
import type { Task } from './db/db.js';
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
  private _tasks: Task[] = [];

  private async _fetchRecord(id: number) {
    const note = await dbFetchNoteById(id);
    if (note) {
      this.text = note.text;
      this.type = note.type ?? '';
      this.created_at = note.created_at;
      this._tasks = note.tasks ?? [];
    }
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('noteId')) {
      this._fetchRecord(this.noteId);
    }
  }

  private _onListChanged(e: Event) {
    const { tasks } = (e as CustomEvent<{ tasks: Task[] }>).detail;
    this._tasks = tasks;
    this.dispatchEvent(new CustomEvent('note-changed', {
      detail: { id: this.noteId, text: this.text, tasks },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <h2>Edit ${this.type}</h2>

      ${this.type === 'List'
        ? html`
            <list-item
              .noteId=${this.noteId}
              .tasks=${this._tasks}
              @list-changed=${this._onListChanged}
            ></list-item>
          `
        : html`
            <note-item
              .noteId=${this.noteId}
              .text=${this.text}
              .created_at=${this.created_at}
            ></note-item>
          `
      }
    `
  }
}

customElements.define('edit-page', EditPage);
