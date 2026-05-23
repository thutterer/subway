import { LitElement, html, css } from 'lit';
import './my-button.js';
import { dbCreateFoo } from './db/db.js';

class NewPage extends LitElement {
  static properties = {
    text: { type: String },
    type: { type: String }
  };

  constructor() {
    super();
    this.type = 'Note';
  }

  _handleSelection(event) {
    this.type = event.target.value;
  }

  _handleTextChange(event) {
    this.text = event.target.value;
  }

  async _create() {
    const newId = await dbCreateFoo(this.text, this.type)

    const event = new CustomEvent('navigate-to', {
      bubbles: true,
      composed: true,
      detail: { id: newId }
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <h2>New</h2>

      <textarea @change=${this._handleTextChange}></textarea>

      <label>What is this?</label>
      <select
        .value=${this.type}
        @change=${this._handleSelection}
      >
        <option>Note</option>
        <option>List</option>
        <option disabled>Event</option>
      </select>

      <my-button @click=${this._create}>Create</my-button>
    `
  }
}

customElements.define('new-page', NewPage);
