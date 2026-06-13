import { css, html, LitElement } from "lit";
import type { Subscription } from "rxjs";
import type { Note } from "./db/db.js";
import { db } from "./db/db.js";
import { globalStyles } from "./shared-styles.js";
import "./note-list.js";

const cloud = (db as any).cloud as
	| {
			currentUser: {
				value: { isLoggedIn: boolean };
				subscribe: (
					cb: (user: { isLoggedIn: boolean }) => void,
				) => Subscription;
			};
			login: () => void;
			logout: () => void;
	  }
	| undefined;

class IndexPage extends LitElement {
	static properties = {
		notes: { type: Array },
	};

	static styles = [
		globalStyles,
		css`
    header {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0 0.5rem;
    }
    header h1 {
      flex-grow: 1;
      font-size: clamp(1.25rem, 4vw, 2rem);
      white-space: nowrap;
    }
    header > a, header .btn {
      background: var(--brand-color);
      color: black;
      padding: 4px 8px;
      border: none;
      cursor: pointer;
      font: inherit;
      font-size: 1rem;
    }
    header > a:hover, header .btn:hover {
      filter: brightness(0.9);
    }
  `,
	];

	notes: Note[] = [];
	#loggedIn = false;
	#sub?: Subscription;

	connectedCallback() {
		super.connectedCallback();
		this.#loggedIn = cloud?.currentUser.value.isLoggedIn === true;
		if (cloud) {
			this.#sub = cloud.currentUser.subscribe((user) => {
				this.#loggedIn = user.isLoggedIn === true;
				this.requestUpdate();
			});
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.#sub?.unsubscribe();
	}

	render() {
		const base = import.meta.env.BASE_URL;
		return html`
      <header>
        <h1><a href=${base}>Subway Notes</a></h1>
        ${
					cloud
						? html`
          <button class="btn" @click=${this.#loggedIn ? cloud.logout : cloud.login}>
            ${this.#loggedIn ? "Logout" : "Login"}
          </button>
        `
						: ""
				}
        <a href="${base}new?type=Note">+ New</a>
      </header>

      <note-list .notes=${this.notes}></note-list>
    `;
	}
}
customElements.define("index-page", IndexPage);
