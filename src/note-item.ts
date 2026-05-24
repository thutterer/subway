import { LitElement, html, css } from 'lit';
import './my-button.js';

const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  });

class NoteItem extends LitElement {
  static properties = {
    noteId: { type: Number },
    text: { type: String },
    created_at: { type: Date },
  };

  static styles = css`
    .note-card {
      border: 1px solid #ccc;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    textarea {
      width: 100%;
      background: transparent;
      border: none;
      resize: vertical;
      font-family: inherit;
      font-size: 1rem;
    }
    textarea:focus {
      outline: none;
    }
  `;

  noteId!: number;
  text!: string;
  created_at!: number;

  private _onInput(e: Event) {
    const text = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('note-changed', {
      detail: { id: this.noteId, text },
      bubbles: true,
      composed: true
    }));
  }

  private _onDelete() {
    if (confirm("Sure?")) {
      this.dispatchEvent(new CustomEvent('note-delete', {
        detail: { id: this.noteId },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    return html`
      <div class="note-card">
        <header>
          <span><a href="/note/${this.noteId}">${formatTimestamp(this.created_at)}</a></span>
          <my-button @click=${this._onDelete}>x</my-button>
        </header>
        <textarea
          .value=${this.text}
          @input=${this._onInput}
          placeholder="Start typing...">
        </textarea>
      </div>
    `;
  }
}
customElements.define('note-item', NoteItem);
