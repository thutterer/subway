import { LitElement, html, css } from 'lit';
import './back-link.js';
import './my-button.js';
import './tile-select.js';
import type { TileOption } from './tile-select.js';
import { dbCreateFoo } from './db/db.js';

const TYPE_OPTIONS: TileOption[] = [
  { value: 'Note', label: 'Note', icon: '📝' },
  { value: 'List', label: 'List', icon: '☑' },
];

class NewPage extends LitElement {
  static styles = css`
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
  `;

  static properties = {
    text: { type: String },
    type: { type: String }
  };

  text = '';
  type = 'Note';

  private _onTypeChange(e: Event) {
    this.type = (e as CustomEvent<{ value: string }>).detail.value;
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
      <div class="header">
        <back-link></back-link>
        <h2>New</h2>
      </div>

      <textarea @change=${this._handleTextChange}></textarea>

      <label>What is this?</label>
      <tile-select
        .options=${TYPE_OPTIONS}
        .value=${this.type}
        @change=${this._onTypeChange}
      ></tile-select>

      <my-button @click=${this._create}>Create</my-button>
    `
  }
}

customElements.define('new-page', NewPage);
