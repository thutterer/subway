import{a as e,i as t,o as n,t as r}from"./index-DMGzsd5Q.js";var i=n`
  a {
    text-decoration: none;
    color: var(--brand-color);
    transition: color 0.15s ease-in-out;
  }
`,a=e=>new Date(e).toLocaleString(void 0,{dateStyle:`short`,timeStyle:`short`}),o=class extends t{constructor(...e){super(...e),this.notes=[]}static{this.properties={notes:{type:Array}}}static{this.styles=n`
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
    }
  `}render(){return this.notes.length===0?e`<p class="empty">No notes yet.</p>`:e`
      <div class="list" role="list">
        ${this.notes.map(t=>e`
          <a class="row" role="listitem" href="${`/subway/`}note/${t.id}">
            <span class="text">${t.text||`Untitled`}</span>
            <span class="date">${a(t.created_at)}</span>
            <span class="type">${t.type||`Note`}</span>
          </a>
        `)}
      </div>
    `}};customElements.define(`note-list`,o);var s=class extends t{constructor(...e){super(...e),this.notes=[]}static{this.properties={notes:{type:Array}}}static{this.styles=[i,n`
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
    header > a {
      background: var(--brand-color);
      color: black;
      padding: 4px 8px;
    }
    header > a:hover {
      filter: brightness(0.9);
    }
  `]}render(){let t=`/subway/`;return e`
      <header>
        <h1><a href=${t}>Subway Notes</a></h1>
        <button @click=${r.cloud.login}>Login</button>
        <a href="${t}new?type=Note">+ New</a>
      </header>

      <note-list .notes=${this.notes}></note-list>
    `}};customElements.define(`index-page`,s);