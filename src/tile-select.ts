import { LitElement, html, css } from 'lit';

export interface TileOption {
  value: string;
  label: string;
  icon: string;
  disabled?: boolean;
}

class TileSelect extends LitElement {
  static properties = {
    options: { type: Array },
    value: { type: String }
  };

  options: TileOption[] = [];
  value = '';

  private _onSelect(value: string) {
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value },
      bubbles: true,
      composed: true
    }));
  }

  static styles = css`
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
      background: white;
      color: black;
      border: 2px solid black;
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 16px;
    }
    .tile.selected {
      background: var(--brand-color, wheat);
      border-color: var(--brand-color, wheat);
      color: black;
    }
    .tile:disabled {
      background: lightgrey;
      color: grey;
      border-color: grey;
      cursor: not-allowed;
    }
    .icon {
      font-size: 2rem;
      line-height: 1;
    }
  `;

  render() {
    return html`
      <div class="tiles" role="radiogroup">
        ${this.options.map(opt => html`
          <button
            class="tile ${opt.value === this.value ? 'selected' : ''}"
            ?disabled=${opt.disabled}
            role="radio"
            aria-checked=${opt.value === this.value}
            @click=${() => this._onSelect(opt.value)}
          >
            <span class="icon">${opt.icon}</span>
            <span class="label">${opt.label}</span>
          </button>
        `)}
      </div>
    `;
  }
}
customElements.define('tile-select', TileSelect);
