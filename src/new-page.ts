import { LitElement, html, css } from 'lit';
import './back-link.js';
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

  private async _onTypeChange(e: Event) {
    const type = (e as CustomEvent<{ value: string }>).detail.value;
    const id = await dbCreateFoo('', type);
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
        <h2>What do you want to create?</h2>
      </div>

      <tile-select
        .options=${TYPE_OPTIONS}
        @change=${this._onTypeChange}
      ></tile-select>
    `
  }
}

customElements.define('new-page', NewPage);
