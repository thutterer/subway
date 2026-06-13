import{a as e,c as t,l as n,t as r}from"./index-CWqXscgY.js";var i=`/subway/`,a=e=>new Date(e).toLocaleString(void 0,{dateStyle:`short`,timeStyle:`short`}),o=class extends e{constructor(...e){super(...e),this.notes=[]}static{this.properties={notes:{type:Array}}}static{this.styles=n`
    .list {
      display: flex;
      flex-direction: column;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.25rem 0.5rem;
      padding: 0.625rem 0.5rem;
      text-decoration: none;
      color: inherit;
      border-bottom: 1px solid var(--border);
    }
    .row:last-child {
      border-bottom: none;
    }
    .row:hover {
      background: rgba(128,128,128,0.12);
    }

    .text {
      flex: 1 1 100%;
      font-family: "Silkscreen", monospace;
      font-size: 1rem;
    }

    .date, .type {
      font-family: "Silkscreen", monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .empty {
      padding: 1rem 0;
      color: var(--text-subtle);
      font-style: italic;
      text-align: center;
    }
  `}render(){return this.notes.length===0?t`<p class="empty">No notes yet.</p>`:t`
      <div class="list" role="list">
        ${this.notes.map(e=>t`
          <a class="row" role="listitem" href="${i}note/${e.id}" @click=${t=>{t.preventDefault();let n=`note/`+e.id;this.dispatchEvent(new CustomEvent(`navigate`,{bubbles:!0,composed:!0,detail:{path:n}}))}}>
            <span class="text">${e.title||`Untitled`}</span>
            <span class="date">${a(e.created_at)}</span>
            <span class="type">${e.type||`Note`}</span>
          </a>
        `)}
      </div>
    `}};customElements.define(`note-list`,o);var s=`/subway/`,c=r.cloud,l=class extends e{constructor(...e){super(...e),this.notes=[],this.#e=!1}static{this.properties={notes:{type:Array}}}static{this.styles=n`
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
  `}#e;#t;connectedCallback(){super.connectedCallback(),this.#e=c?.currentUser.value.isLoggedIn===!0,c&&(this.#t=c.currentUser.subscribe(e=>{this.#e=e.isLoggedIn===!0,this.requestUpdate()}))}disconnectedCallback(){super.disconnectedCallback(),this.#t?.unsubscribe()}#n(e){e.preventDefault(),this.dispatchEvent(new CustomEvent(`navigate`,{bubbles:!0,composed:!0,detail:{path:``}}))}#r(e){e.preventDefault(),this.dispatchEvent(new CustomEvent(`navigate`,{bubbles:!0,composed:!0,detail:{path:`new`}}))}render(){return t`
      <header>
        <h1><a href=${s} @click=${this.#n}>Subway Notes</a></h1>
        ${c?t`
          <button class="btn" @click=${this.#e?c.logout:c.login}>
            ${this.#e?`Logout`:`Login`}
          </button>
        `:``}
        <a href="${s}new" @click=${this.#r}>+ New</a>
      </header>

      <note-list .notes=${this.notes}></note-list>
    `}};customElements.define(`index-page`,l);