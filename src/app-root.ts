import { LitElement, html, css } from 'lit';
import { Router } from '@lit-labs/router';
import { liveQuery } from 'dexie';
import { dbFetchAll, dbUpdateNote, dbDeleteNote } from './db/db.js';
import type { Note, Task } from './db/db.js';

import { globalStyles } from './shared-styles.js';
import './my-button.js';

class AppRoot extends LitElement {
  static properties = {
    notes: { type: Array }
  };

  static styles = [globalStyles, css`
    header {
      display: flex;
      gap: 1rem;
      align-items: center;

      > h1 {
        flex-grow: 1;
      }

      > a {
        background: var(--brand-color);
        color: black;
        padding: 4px 8px;

        &:hover {
          filter: brightness(1.1);
          color: black:
        }
      }

    }
  `];

  notes: Note[] = [];

  #router = new Router(this, [
    {
      path: '/',
      render: () => html`<note-list .notes=${this.notes}></note-list>`,
      enter: () => { import('./note-list.js'); return true; },
    },
    {
      path: '/new',
      render: () => {
        const raw = new URLSearchParams(window.location.search).get('type') ?? '';
        const type = ['Note', 'List'].includes(raw) ? raw : 'Note';
        return html`
          <new-page
            .type=${type}
            @navigate-to=${this.#onNavigate}>
          </new-page>
        `;
      },
      enter: () => { import('./new-page.js'); return true; },
    },
    {
      path: '/note/:id',
      render: (params) => html`<edit-page .noteId=${Number(params.id)}></edit-page>`,
      enter: () => { import('./edit-page.js'); return true; },
    },
    {
      path: '/*',
      render: () => html`<h2>404</h2>`
    }
  ]);

  #subscription?: { unsubscribe: () => void };

  connectedCallback() {
    super.connectedCallback();
    this.#subscription = liveQuery(() => dbFetchAll()).subscribe({
      next: (data) => {
        this.notes = data;
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#subscription?.unsubscribe();
  }

  #onNavigate(e: Event) {
    const { id } = (e as CustomEvent<{ id: number }>).detail;
    const path = `/note/${id}`;
    window.history.pushState({}, '', path);
    this.#router.goto(path);
  }

  #onNoteChanged(e: Event) {
    const { id, text, tasks } = (e as CustomEvent<{ id: number; text: string; tasks?: Task[] }>).detail;
    dbUpdateNote(id, text, tasks);
  }

  #onNoteDeleted(e: Event) {
    const { id } = (e as CustomEvent<{ id: number }>).detail;
    dbDeleteNote(id);
  }

  render() {
    return html`
      <header>
        <h1><a href="/">Subway Notes</a></h1>
        <a href="/new?type=Note">+ New</a>
      </header>

      <main
        @note-changed=${this.#onNoteChanged}
        @note-delete=${this.#onNoteDeleted}
      >
        ${this.#router.outlet()}
      </main>
    `;
  }
}
customElements.define('app-root', AppRoot);
