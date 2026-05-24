import { LitElement, html, css } from 'lit';
import type { Task } from './db/db.js';

class ListItem extends LitElement {
  static properties = {
    noteId: { type: Number },
    tasks: { type: Array }
  };

  noteId!: number;
  tasks: Task[] = [];

  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--border);
    }

    .track {
      height: 0.5rem;
      background: var(--border);
    }
    .fill {
      height: 100%;
      background: var(--brand-color, wheat);
      transition: width 0.3s ease;
      animation: shimmer 2s ease-in-out infinite;
    }
    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.75; }
    }

    .task {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      border-bottom: 1px solid var(--border);
    }
    .task:last-of-type {
      border-bottom: none;
    }

    .indicator {
      flex-shrink: 0;
      font-size: 1rem;
    }

    .text {
      flex: 1;
      font-family: "Silkscreen", monospace;
      font-size: 1rem;
    }
    .text.done {
      text-decoration: line-through;
      opacity: 0.5;
    }

    .delete {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 1rem;
      padding: 0.25rem;
      color: var(--text-muted);
    }
    .delete:hover {
      color: var(--text-strong);
    }

    .add-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      border-top: 1px solid var(--border-light);
    }

    .add-row input {
      flex: 1;
      font-family: "Silkscreen", monospace;
      font-size: 1rem;
      padding: 0.25rem;
      border: 1px solid var(--border-light);
      background: transparent;
    }
    .add-row input:focus {
      outline: none;
      border-color: var(--brand-color, wheat);
    }
  `;

  private _addTask() {
    const input = this.renderRoot.querySelector('input')!;
    const text = input.value.trim();
    if (!text) return;
    this.tasks = [...this.tasks, { id: crypto.randomUUID(), text, done: false }];
    input.value = '';
    this._dispatch();
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._addTask();
    }
  }

  private _toggleTask(id: string) {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    this._dispatch();
  }

  private _deleteTask(e: Event, id: string) {
    e.stopPropagation();
    this.tasks = this.tasks.filter(t => t.id !== id);
    this._dispatch();
  }

  private _dispatch() {
    this.dispatchEvent(new CustomEvent('list-changed', {
      detail: { id: this.noteId, tasks: this.tasks },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const done = this.tasks.filter(t => t.done).length;
    const pct = this.tasks.length > 0 ? (done / this.tasks.length) * 100 : 0;

    return html`
      <div class="list-card">
        <div class="track"><div class="fill" style="width: ${pct}%"></div></div>
        ${this.tasks.map(task => html`
          <div class="task" @click=${() => this._toggleTask(task.id)}>
            <span class="indicator">${task.done ? '☑' : '☐'}</span>
            <span class="text ${task.done ? 'done' : ''}">${task.text}</span>
            <button class="delete" @click=${(e: Event) => this._deleteTask(e, task.id)}>x</button>
          </div>
        `)}

        <div class="add-row">
          <input
            @keydown=${this._onKeyDown}
            placeholder="Add item..."
          />
          <button class="delete" @click=${this._addTask}>+</button>
        </div>
      </div>
    `;
  }
}
customElements.define('list-item', ListItem);
