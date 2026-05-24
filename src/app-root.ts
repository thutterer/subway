import { LitElement, html } from 'lit';
import { Router } from '@lit-labs/router';
import { liveQuery } from 'dexie';
import { dbFetchAll, dbUpdateNote, dbDeleteNote } from './db/db.js';
import type { Note, Task } from './db/db.js';

class AppRoot extends LitElement {
  static properties = {
    notes: { type: Array }
  };

  notes: Note[] = [];

  #router = new Router(this, [
    {
      path: '/',
      render: () => html`<index-page .notes=${this.notes}></index-page>`,
      enter: () => { import('./index-page.js'); return true; },
    },
    {
      path: '/new',
      render: () => {
        return html`
          <new-page
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
