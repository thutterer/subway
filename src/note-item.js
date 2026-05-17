import { LitElement, html, css } from 'lit';

class NoteItem extends LitElement {
  static properties = {
    id: { type: Number },
    text: { type: String }
  };

  static styles = css`
    .note-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 0.5rem;
      background: white;
    }
    textarea {
      width: 100%;
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
    console.log('DELETEEE')
    const event = new CustomEvent('note-delete', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    })

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div class="note-card">
        <textarea
          .value=${this.text}
          @input=${this._onInput}
          placeholder="Start typing your subway note...">
        </textarea>
        <button
          confirm="Sure?"
          @click=${this._onDelete}
        >x</button>
      </div>
    `;
  }
}
customElements.define('note-item', NoteItem);
