import{a as e,i as t,n,o as r}from"./index-DMGzsd5Q.js";import"./back-link-dpVkORyQ.js";var i=class extends t{constructor(...e){super(...e),this.options=[],this.value=``}static{this.properties={options:{type:Array},value:{type:String}}}_onSelect(e){this.value=e,this.dispatchEvent(new CustomEvent(`change`,{detail:{value:e},bubbles:!0,composed:!0}))}static{this.styles=r`
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
      font-size: 2rem;
      line-height: 1;
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
    `}};customElements.define(`tile-select`,i);var a=[{value:`Note`,label:`Note`,icon:`📝`},{value:`List`,label:`List`,icon:`☑`}],o=class extends t{static{this.styles=r`
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
        .options=${a}
        @change=${this._onTypeChange}
      ></tile-select>
    `}};customElements.define(`new-page`,o);