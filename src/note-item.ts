import { LitElement, html, css } from 'lit';

class NoteItem extends LitElement {
  static properties = {
    noteId: {},
    text: { type: String },
  };

  static styles = css`
    .note-card {
      border: 1px solid var(--border-light);
    }

    textarea {
      width: 100%;
      height: 80vh;
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

  noteId!: string;
  text!: string;

  private _onInput(e: Event) {
    const text = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent('note-changed', {
      detail: { id: this.noteId, text },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="note-card">
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
