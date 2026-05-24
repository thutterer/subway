import{a as e,i as t,o as n,r,t as i}from"./index-Ceq89zcR.js";import"./back-link-pIKYS1cP.js";var a=class extends t{static{this.properties={noteId:{},text:{type:String}}}static{this.styles=n`
    .note-card {
      border: 1px solid var(--border-light);
    }

    textarea {
      width: 100%;
      background: transparent;
      border: none;
      resize: vertical;
      font-family: inherit;
      font-size: 1rem;
    }
    textarea:focus {
      outline: none;
    }
  `}_onInput(e){let t=e.target.value;this.dispatchEvent(new CustomEvent(`note-changed`,{detail:{id:this.noteId,text:t},bubbles:!0,composed:!0}))}render(){return e`
      <div class="note-card">
        <textarea
          .value=${this.text}
          @input=${this._onInput}
          placeholder="Start typing...">
        </textarea>
      </div>
    `}};customElements.define(`note-item`,a);var o=class extends t{constructor(...e){super(...e),this.tasks=[]}static{this.properties={noteId:{},tasks:{type:Array}}}static{this.styles=n`
    :host {
      display: block;
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
  `}_addTask(){let e=this.renderRoot.querySelector(`input`),t=e.value.trim();t&&(this.tasks=[...this.tasks,{id:crypto.randomUUID(),text:t,done:!1}],e.value=``,this._dispatch())}_onKeyDown(e){e.key===`Enter`&&this._addTask()}_toggleTask(e){this.tasks=this.tasks.map(t=>t.id===e?{...t,done:!t.done}:t),this._dispatch()}_deleteTask(e,t){e.stopPropagation(),this.tasks=this.tasks.filter(e=>e.id!==t),this._dispatch()}_dispatch(){this.dispatchEvent(new CustomEvent(`list-changed`,{detail:{id:this.noteId,tasks:this.tasks},bubbles:!0,composed:!0}))}render(){let t=this.tasks.filter(e=>e.done).length;return e`
      <div>
        <div class="track"><div class="fill" style="width: ${this.tasks.length>0?t/this.tasks.length*100:0}%"></div></div>
        ${this.tasks.map(t=>e`
          <div class="task" @click=${()=>this._toggleTask(t.id)}>
            <span class="indicator">${t.done?`☑`:`☐`}</span>
            <span class="text ${t.done?`done`:``}">${t.text}</span>
            <button class="delete" @click=${e=>this._deleteTask(e,t.id)}>x</button>
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
    `}};customElements.define(`list-item`,o);var s=class extends t{constructor(...e){super(...e),this.noteId=``,this.type=``,this.text=``,this._tasks=[],this._editing=!1}static{this.properties={noteId:{},text:{type:String},type:{type:String},_editing:{state:!0}}}static{this.styles=n`
    .list-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .note-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .title-text {
      font-family: "Silkscreen", monospace;
      font-size: 1.5rem;
    }
    .title-input {
      flex: 1;
      font-family: "Silkscreen", monospace;
      font-size: 1.5rem;
      padding: 0;
      border: 1px solid var(--brand-color, wheat);
      background: transparent;
    }
    .title-input:focus {
      outline: none;
    }
    .edit-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: "Silkscreen", monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .edit-btn:hover {
      color: var(--text-strong);
    }

    .footer {
      display: flex;
      justify-content: center;

      .delete {
        margin-top: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-family: "Silkscreen", monospace;
        font-size: 0.75rem;
        color: var(--text-muted);

        &:hover {
          color: var(--text-strong);
        }
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.noteId&&this._subscribe(this.noteId)}disconnectedCallback(){super.disconnectedCallback(),this._sub?.unsubscribe()}_subscribe(e){this._sub?.unsubscribe(),this._sub=r(()=>i.notes.get(e)).subscribe({next:e=>{e&&(this.text=e.text,this.type=e.type??``,this._tasks=e.tasks??[])}})}willUpdate(e){e.has(`noteId`)&&this._subscribe(this.noteId)}_delete(){confirm(`Delete this note?`)&&(this.dispatchEvent(new CustomEvent(`note-delete`,{detail:{id:this.noteId},bubbles:!0,composed:!0})),window.location.href=`/subway/`)}_startEdit(){this._editing=!0,this.updateComplete.then(()=>{this.renderRoot.querySelector(`.title-input`)?.focus()})}_save(e){let t=e.target;this.text=t.value,this._editing=!1,this.dispatchEvent(new CustomEvent(`note-changed`,{detail:{id:this.noteId,text:this.text,tasks:this._tasks},bubbles:!0,composed:!0}))}_onKeyDown(e){(e.key===`Enter`||e.key===`Escape`)&&e.target.blur()}_onListChanged(e){let{tasks:t}=e.detail;this._tasks=t,this.dispatchEvent(new CustomEvent(`note-changed`,{detail:{id:this.noteId,text:this.text,tasks:t},bubbles:!0,composed:!0}))}render(){return e`
      ${this.type===`List`?e`
            <div class="list-header">
              <back-link></back-link>
              ${this._editing?e`<input class="title-input" .value=${this.text} @blur=${this._save} @keydown=${this._onKeyDown} />`:e`<span class="title-text">${this.text||`Untitled`}</span><button class="edit-btn" @click=${this._startEdit}>edit</button>`}
            </div>
            <list-item
              .noteId=${this.noteId}
              .tasks=${this._tasks}
              @list-changed=${this._onListChanged}
            ></list-item>
          `:e`
            <div class="note-header">
              <back-link></back-link>
            </div>
            <note-item
              .noteId=${this.noteId}
              .text=${this.text}
            ></note-item>
          `}
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `}};customElements.define(`edit-page`,s);