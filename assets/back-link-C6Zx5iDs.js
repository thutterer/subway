import{a as e,c as t,l as n}from"./index-Bxa4ysPg.js";var r=class extends e{static{this.styles=n`
    a {
      text-decoration: none;
      color: var(--text-muted);
      padding: 2px 8px;

      &:hover {
        color: var(--text-strong);
      }
    }
  `}#e(e){e.preventDefault(),this.dispatchEvent(new CustomEvent(`navigate`,{bubbles:!0,composed:!0,detail:{path:``}}))}render(){return t`<a href="/" @click=${this.#e}>&lt;</a>`}};customElements.define(`back-link`,r);