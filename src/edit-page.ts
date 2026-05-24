import { LitElement, html, css } from 'lit';
import './back-link.js';
import './note-item.js';
import './list-item.js';
import type { Task } from './db/db.js';
import { dbFetchNoteById } from './db/db.js';

class EditPage extends LitElement {
  static properties = {
    noteId: {},
    text: { type: String },
    type: { type: String },
  };

  static styles = css`
    .list-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .note-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .title-text {
      font-family: "Silkscreen", monospace;
      font-size: 1.5rem;
    }
    .title-input {
      flex: 1;
      font-family: "Silkscreen", monospace;
      font-size: 1.5rem;
      padding: 0;
      border: 1px solid var(--brand-color, wheat);
      background: transparent;
    }
    .title-input:focus {
      outline: none;
    }
    .edit-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .edit-btn:hover {
      color: var(--text-strong);
    }

    .footer {
      display: flex;
      justify-content: center;

      .delete {
        margin-top: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-family: "Silkscreen", monospace;
        font-size: 0.75rem;
        color: var(--text-muted);

        &:hover {
          color: var(--text-strong);
        }
      }
    }
  `;

  noteId!: string;
  type = '';
  text = '';
  created_at = 0;
  private _tasks: Task[] = [];
  private _editingTitle = false;

  private async _fetchRecord(id: string) {
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

  private _delete() {
    if (confirm("Delete this note?")) {
      this.dispatchEvent(new CustomEvent('note-delete', {
        detail: { id: this.noteId },
        bubbles: true,
        composed: true
      }));
      window.location.href = import.meta.env.BASE_URL;
    }
  }

  private _startEdit() {
    this._editingTitle = true;
    this.requestUpdate();
    this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector<HTMLInputElement>('.title-input');
      input?.focus();
    });
  }

  private _saveTitle(e: Event) {
    const input = e.target as HTMLInputElement;
    this.text = input.value;
    this._editingTitle = false;
    this.dispatchEvent(new CustomEvent('note-changed', {
      detail: { id: this.noteId, text: this.text, tasks: this._tasks },
      bubbles: true,
      composed: true
    }));
  }

  private _onTitleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      (e.target as HTMLInputElement).blur();
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
      ${this.type === 'List'
        ? html`
            <div class="list-header">
              <back-link></back-link>
              ${this._editingTitle
                ? html`<input class="title-input" .value=${this.text} @blur=${this._saveTitle} @keydown=${this._onTitleKeyDown} />`
                : html`<span class="title-text">${this.text || 'Untitled'}</span><button class="edit-btn" @click=${this._startEdit}>edit</button>`
              }
            </div>
            <list-item
              .noteId=${this.noteId}
              .tasks=${this._tasks}
              @list-changed=${this._onListChanged}
            ></list-item>
          `
        : html`
            <div class="note-header">
              <back-link></back-link>
            </div>
            <note-item
              .noteId=${this.noteId}
              .text=${this.text}
              .created_at=${this.created_at}
            ></note-item>
          `
      }
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `
  }
}

customElements.define('edit-page', EditPage);
