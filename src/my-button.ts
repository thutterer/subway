import { LitElement, css, html } from 'lit'

export class MyButton extends LitElement {
  static properties = {
    disabled: { type: Boolean },
    type: { type: String }
  };

  constructor() {
    super();
    this.disabled = false;
    this.type = 'button';
  }

  static styles = css`
    button {
      background: white;
      color: black;
      padding: 0.5em 1ch;
      font-family: "Silkscreen", monospace;
      font-size: 16px;
      border: 2px solid black;
      cursor: pointer;
    }

    button:disabled {
      background: lightgrey;
      color: grey;
      border-color: grey;
      cursor: not-allowed;
    }
  `

  render() {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `
  }
}

customElements.define('my-button', MyButton);
