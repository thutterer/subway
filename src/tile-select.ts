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
      background: var(--surface);
      color: var(--text-strong);
      border: 2px solid var(--border);
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 16px;
      box-shadow: 3px 3px 0 0 var(--shadow);
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .tile:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 0 var(--shadow);
    }
    .tile:active {
      transform: translate(2px, 2px);
      box-shadow: 1px 1px 0 0 var(--shadow);
    }
    .tile.selected {
      background: var(--brand-color);
      border-color: var(--brand-color);
      color: var(--text-on-brand);
      box-shadow: 3px 3px 0 0 var(--shadow);
    }
    .tile.selected:hover {
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 0 var(--shadow);
    }
    .tile.selected:active {
      transform: translate(2px, 2px);
      box-shadow: 1px 1px 0 0 var(--shadow);
    }
    .tile:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
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
