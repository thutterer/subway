import { css, html, LitElement, type TemplateResult } from "lit";

export interface TileOption {
	value: string;
	label: string;
	icon: TemplateResult;
	disabled?: boolean;
}

class TileSelect extends LitElement {
	static properties = {
		options: { type: Array },
		value: { type: String },
	};

	options: TileOption[] = [];
	value = "";

	private _onSelect(value: string) {
		this.value = value;
		this.dispatchEvent(
			new CustomEvent("tile-select", {
				detail: { value },
				bubbles: true,
				composed: true,
			}),
		);
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
      font-family: "Silkscreen", monospace;
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
  `;

	render() {
		return html`
      <div class="tiles" role="radiogroup">
        ${this.options.map(
					(opt) => html`
          <button
            class="tile ${opt.value === this.value ? "selected" : ""}"
            ?disabled=${opt.disabled}
            role="radio"
            aria-checked=${opt.value === this.value}
            @click=${() => this._onSelect(opt.value)}
          >
            <span class="icon">${opt.icon}</span>
            <span class="label">${opt.label}</span>
          </button>
        `,
				)}
      </div>
    `;
	}
}
customElements.define("tile-select", TileSelect);
