import{a as e,i as t,n,o as r}from"./index-CeHKuQv2.js";import"./back-link-DCkpG2CW.js";var i=class extends t{constructor(...e){super(...e),this.options=[],this.value=``}static{this.properties={options:{type:Array},value:{type:String}}}_onSelect(e){this.value=e,this.dispatchEvent(new CustomEvent(`change`,{detail:{value:e},bubbles:!0,composed:!0}))}static{this.styles=r`
    :host {
      display: block;
    }
    .tiles {
      display: flex;
      gap: 1rem;
    }
    .tile {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem 1rem;
      min-width: 120px;
      background: var(--surface);
      color: var(--text-strong);
      border: 2px solid var(--border);
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 16px;
      box-shadow: 3px 3px 0 0 var(--shadow);
      transition: filter 0.1s;
    }
    .tile:hover {
      filter: brightness(1.08);
    }
    .tile:active {
      filter: brightness(0.95);
    }
    .tile.selected {
      background: var(--brand-color);
      border-color: var(--brand-color);
      color: var(--text-on-brand);
      box-shadow: 3px 3px 0 0 var(--shadow);
    }
    .tile.selected:hover {
      filter: brightness(1.08);
    }
    .tile.selected:active {
      filter: brightness(0.95);
    }
    .tile:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .icon {
      width: 2rem;
      height: 2rem;
    }
    .icon svg {
      width: 100%;
      height: 100%;
    }
  `}render(){return e`
      <div class="tiles" role="radiogroup">
        ${this.options.map(t=>e`
          <button
            class="tile ${t.value===this.value?`selected`:``}"
            ?disabled=${t.disabled}
            role="radio"
            aria-checked=${t.value===this.value}
            @click=${()=>this._onSelect(t.value)}
          >
            <span class="icon">${t.icon}</span>
            <span class="label">${t.label}</span>
          </button>
        `)}
      </div>
    `}};customElements.define(`tile-select`,i);var a=e`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4h-2v6h6V8h2v14H2V2h14v2ZM4 20h16v-8h-8V4H4v16Zm8-2H6v-2h6v2Zm-2-4H6v-2h4v2Zm10-6h-2V6h2v2Zm-2-2h-2V4h2v2Z"/></svg>`,o=e`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M10 5h12v2H10zm0 4h8v2h-8zm0 4h12v2H10zm0 4h8v2h-8zM4 7v2h2V7H4Zm4 4H2V5h6v6Zm-6 2h6v2H2zm0 4h6v2H2zm0 0v-2h2v2zm4 0v-2h2v2z"/></svg>`,s=[{value:`Note`,label:`Note`,icon:a},{value:`List`,label:`List`,icon:o}],c=class extends t{static{this.styles=r`
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
  `}async _onTypeChange(e){let t=e.detail.value,r=await n(``,t);this.dispatchEvent(new CustomEvent(`navigate-to`,{bubbles:!0,composed:!0,detail:{id:r}}))}render(){return e`
      <div class="header">
        <back-link></back-link>
        <h2>What do you want to create?</h2>
      </div>

      <tile-select
        .options=${s}
        @change=${this._onTypeChange}
      ></tile-select>
    `}};customElements.define(`new-page`,c);