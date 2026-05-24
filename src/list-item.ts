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
      border: 1px solid #ccc;
    }

    .task {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      border-bottom: 1px solid #eee;
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
      color: #999;
    }
    .delete:hover {
      color: #000;
    }

    .add-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      border-top: 1px solid #ccc;
    }

    .add-row input {
      flex: 1;
      font-family: "Silkscreen", monospace;
      font-size: 1rem;
      padding: 0.25rem;
      border: 1px solid #ccc;
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
    return html`
      <div class="list-card">
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
            placeholder="What next?"
          />
          <button class="delete" @click=${this._addTask}>+</button>
        </div>
      </div>
    `;
  }
}
customElements.define('list-item', ListItem);
