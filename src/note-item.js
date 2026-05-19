import { LitElement, html, css } from 'lit';
import './my-button.js';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

class NoteItem extends LitElement {
  static properties = {
    id: { type: Number },
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

  constructor() {
    super();
    this.id = null;
    this.text = '';
  }

  _onInput(e) {
    const newText = e.target.value;

    // Create and dispatch a native browser event carrying the updated data
    const event = new CustomEvent('note-changed', {
      detail: { id: this.id, text: newText },
      bubbles: true,    // Allows the event to travel up through parent elements
      composed: true   // Allows the event to cross the Shadow DOM boundary
    });

    this.dispatchEvent(event);
  }

  _onDelete() {
    const yes = confirm("Sure?")

    if (yes) {
      const event = new CustomEvent('note-delete', {
        detail: { id: this.id },
        bubbles: true,
        composed: true
      })

      this.dispatchEvent(event);
    }
  }

  render() {
    return html`
      <div class="note-card">
        <header>
          <span>${formatTimestamp(this.created_at)}</span>
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
