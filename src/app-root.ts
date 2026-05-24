import { LitElement, html, css } from 'lit';
import { Router } from '@lit-labs/router';
import { liveQuery } from 'dexie';
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
      >
      </note-list>`,
      enter: async () => { await import('./note-list.js') },
    },
    {
      path: '/new',
      render: () => {
        const searchParams = new URLSearchParams(window.location.search);
        let typeParam = searchParams.get('type') || '';
        const allowedTypes = ['Note', 'List'];

        if (!allowedTypes.includes(typeParam)) {
          typeParam = allowedTypes[0];
        }

        return html`
          <new-page
            .type=${typeParam}
            @navigate-to=${this._navTo}>
          </new-page>
        `;
      },
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

    this.subscription = liveQuery(() => dbFetchAll()).subscribe({
      next: (data) => {
        this.notes = data;
        this.requestUpdate();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  async handleNoteUpdate(e) {
    const { id, text } = e.detail;
    await dbUpdateNote(id, text);
  }

  async handleNoteDelete(e) {
    const { id } = e.detail;
    await dbDeleteNote(id);
  }

  render() {
    return html`
      <header>
        <h1><a href="/">Subway Notes</a></h1>
        <a href="/new?type=Note">New</a>
        <a href="/new?type=List">New list</a>
      </header>

      <main
        @note-changed=${this.handleNoteUpdate}
        @note-delete=${this.handleNoteDelete}
      >
        ${this.#router.outlet()}
      </main>
    `;
  }
}
customElements.define('app-root', AppRoot);
