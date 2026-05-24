import { LitElement, html, css } from 'lit';
import type { Note } from './db/db.js';
import { globalStyles } from './shared-styles.js';
import './note-list.js';

class IndexPage extends LitElement {
  static properties = {
    notes: { type: Array }
  };

  static styles = [globalStyles, css`
    header {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    header h1 {
      flex-grow: 1;
    }
    header > a {
      background: var(--brand-color);
      color: black;
      padding: 4px 8px;
    }
    header > a:hover {
      filter: brightness(0.9);
    }
  `];

  notes: Note[] = [];

  render() {
    return html`
      <header>
        <h1><a href="/">Subway Notes</a></h1>
        <a href="/new?type=Note">+ New</a>
      </header>

      <note-list .notes=${this.notes}></note-list>
    `;
  }
}
customElements.define('index-page', IndexPage);
