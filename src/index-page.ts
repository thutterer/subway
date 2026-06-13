import { css, html, LitElement } from "lit";
import type { Subscription } from "rxjs";
import type { Doc } from "./db/db.js";
import { db } from "./db/db.js";
import "./note-list.js";

const base = import.meta.env.BASE_URL;

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

	static styles = css`
    a {
      color: var(--brand-color);
    }
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
  `;

	notes: Doc[] = [];
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

	#onHomeClick(e: MouseEvent) {
		e.preventDefault();
		this.dispatchEvent(
			new CustomEvent("navigate", {
				bubbles: true,
				composed: true,
				detail: { path: "" },
			}),
		);
	}

	#onNewClick(e: MouseEvent) {
		e.preventDefault();
		this.dispatchEvent(
			new CustomEvent("navigate", {
				bubbles: true,
				composed: true,
				detail: { path: "new" },
			}),
		);
	}

	render() {
		return html`
      <header>
        <h1><a href=${base} @click=${this.#onHomeClick}>Subway Notes</a></h1>
        ${
					cloud
						? html`
          <button class="btn" @click=${this.#loggedIn ? cloud.logout : cloud.login}>
            ${this.#loggedIn ? "Logout" : "Login"}
          </button>
        `
						: ""
				}
        <a href="${base}new" @click=${this.#onNewClick}>+ New</a>
      </header>

      <note-list .notes=${this.notes}></note-list>
    `;
	}
}
customElements.define("index-page", IndexPage);
