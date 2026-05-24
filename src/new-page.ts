import { LitElement, html } from 'lit';
import './my-button.js';
import { dbCreateFoo } from './db/db.js';

class NewPage extends LitElement {
  static properties = {
    text: { type: String },
    type: { type: String }
  };

  text = '';
  type: string = 'Note';

  private _handleSelection(e: Event) {
    this.type = (e.target as HTMLSelectElement).value;
  }

  private _handleTextChange(e: Event) {
    this.text = (e.target as HTMLTextAreaElement).value;
  }

  private async _create() {
    const id = await dbCreateFoo(this.text, this.type);
    this.dispatchEvent(new CustomEvent('navigate-to', {
      bubbles: true,
      composed: true,
      detail: { id }
    }));
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
