import { LitElement, html, css } from 'lit';
import { Router } from '@lit-labs/router';
import { dbFetchAll, dbCreateNote, dbDeleteNote, dbUpdateNote } from './db/db.js';

import { globalStyles } from './shared-styles.js';
import './my-button.js';

class AppRoot extends LitElement {
  static properties = {
    notes: { type: Array }
  };

  static styles = [
    globalStyles
  ]

  _navTo(event) {
    const { id } = event.detail
    const path = `/note/${id}`
    window.history.pushState({}, '', path);
    this.#router.goto(path)
  }

  // Initialize the router controller
  #router = new Router(this, [
    {
      path: '/',
      render: () => html`<note-list
        .notes=${this.notes}
        @note-changed=${this.handleNoteUpdate}
        @note-delete=${this.handleNoteDelete}
      >
      </note-list>`,
      enter: async () => { await import('./note-list.js') },
    },
    {
      path: '/new',
      render: () => html`<new-page @navigate-to=${this._navTo}></new-page>`,
      enter: async (_params) => {
        await import('./new-page.js');
      },
    },
    {
      path: '/note/:id',
      render: (params) => html`<edit-page .id=${Number(params.id)}></edit-page>`,
      enter: async (_params) => {
        await import('./edit-page.js');
      },
    },
    {
      path: '/*',
      render: () => html`<h2>404 - Page Not Found</h2>`
    }
  ]);

  constructor() {
    super();
    this.notes = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.refreshNotes();
  }

  async refreshNotes() {
    this.notes = await dbFetchAll();
  }

  async handleCreate() {
    await dbCreateNote();
    await this.refreshNotes();
  }

  async handleNoteUpdate(e) {
    const { id, text } = e.detail;
    await dbUpdateNote(id, text);
    await this.refreshNotes();
  }

  async handleNoteDelete(e) {
    const { id } = e.detail;
    await dbDeleteNote(id);
    await this.refreshNotes();
  }

  render() {
    return html`
      <header>
        <h1><a href="/">Subway Notes</a></h1>
        <a href="/new">New</a>
        <my-button @click=${this.handleCreate}>+ New Note</my-button>
        <my-button disabled @click=${this.handleCreate}>[] New List</my-button>
      </header>

      ${this.#router.outlet()}
    `;
  }
}
customElements.define('app-root', AppRoot);
