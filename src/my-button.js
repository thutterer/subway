import { LitElement, css, html } from 'lit'

export class MyButton extends LitElement {
  static styles = css`
    button {
      background: white;
      color: black;
      padding: 0.5em 1ch;

      font-family: "Silkscreen", monospace;
      font-size: 16px;
    }
  `

  render() {
    return html`
      <button>
        <slot></slot>
      </button>
    `
  }
}

customElements.define('my-button', MyButton);
