import { Router } from "@lit-labs/router";
import { liveQuery } from "dexie";
import { html, LitElement } from "lit";
import type { Note } from "./db/db.js";
import { dbFetchAll } from "./db/db.js";

class AppRoot extends LitElement {
	static properties = {
		notes: { type: Array },
	};

	notes: Note[] = [];

	#base = import.meta.env.BASE_URL;

	#router = new Router(this, [
		{
			path: `${this.#base}`,
			render: () => html`<index-page .notes=${this.notes}></index-page>`,
			enter: () => {
				import("./index-page.js");
				return true;
			},
		},
		{
			path: `${this.#base}new`,
			render: () => html`<new-page></new-page>`,
			enter: () => {
				import("./new-page.js");
				return true;
			},
		},
		{
			path: `${this.#base}note/:id`,
			render: (params) => html`<edit-page .noteId=${params.id}></edit-page>`,
			enter: () => {
				import("./edit-page.js");
				return true;
			},
		},
		{
			path: `${this.#base}*`,
			render: () => html`<h2>404</h2>`,
		},
	]);

	#subscription?: { unsubscribe: () => void };

	connectedCallback() {
		super.connectedCallback();
		this.#subscription = liveQuery(() => dbFetchAll()).subscribe({
			next: (data) => {
				this.notes = data;
			},
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#subscription?.unsubscribe();
	}

	#onNavigate(e: Event) {
		const { path } = (e as CustomEvent<{ path: string }>).detail;
		const full = `${this.#base}${path}`;
		window.history.pushState({}, "", full);
		this.#router.goto(full);
	}

	render() {
		return html`
      <main @navigate=${this.#onNavigate}>
        ${this.#router.outlet()}
      </main>
    `;
	}
}
customElements.define("app-root", AppRoot);
