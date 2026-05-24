import{a as e,i as t,n,r}from"./index-BoVbDRiX.js";import"./back-link-BuXtamuu.js";var i=class extends r{static{this.properties={noteId:{type:Number},text:{type:String},created_at:{type:Number}}}static{this.styles=e`
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
  `}_onInput(e){let t=e.target.value;this.dispatchEvent(new CustomEvent(`note-changed`,{detail:{id:this.noteId,text:t},bubbles:!0,composed:!0}))}render(){return t`
      <div class="note-card">
        <textarea
          .value=${this.text}
          @input=${this._onInput}
          placeholder="Start typing...">
        </textarea>
      </div>
    `}};customElements.define(`note-item`,i);var a=class extends r{constructor(...e){super(...e),this.tasks=[]}static{this.properties={noteId:{type:Number},tasks:{type:Array}}}static{this.styles=e`
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
  `}_addTask(){let e=this.renderRoot.querySelector(`input`),t=e.value.trim();t&&(this.tasks=[...this.tasks,{id:crypto.randomUUID(),text:t,done:!1}],e.value=``,this._dispatch())}_onKeyDown(e){e.key===`Enter`&&this._addTask()}_toggleTask(e){this.tasks=this.tasks.map(t=>t.id===e?{...t,done:!t.done}:t),this._dispatch()}_deleteTask(e,t){e.stopPropagation(),this.tasks=this.tasks.filter(e=>e.id!==t),this._dispatch()}_dispatch(){this.dispatchEvent(new CustomEvent(`list-changed`,{detail:{id:this.noteId,tasks:this.tasks},bubbles:!0,composed:!0}))}render(){let e=this.tasks.filter(e=>e.done).length;return t`
      <div>
        <div class="track"><div class="fill" style="width: ${this.tasks.length>0?e/this.tasks.length*100:0}%"></div></div>
        ${this.tasks.map(e=>t`
          <div class="task" @click=${()=>this._toggleTask(e.id)}>
            <span class="indicator">${e.done?`☑`:`☐`}</span>
            <span class="text ${e.done?`done`:``}">${e.text}</span>
            <button class="delete" @click=${t=>this._deleteTask(t,e.id)}>x</button>
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
    `}};customElements.define(`list-item`,a);var o=class extends r{constructor(...e){super(...e),this.type=``,this.text=``,this.created_at=0,this._tasks=[],this._editingTitle=!1}static{this.properties={noteId:{type:Number},text:{type:String},type:{type:String}}}static{this.styles=e`
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
  `}async _fetchRecord(e){let t=await n(e);t&&(this.text=t.text,this.type=t.type??``,this.created_at=t.created_at,this._tasks=t.tasks??[])}willUpdate(e){e.has(`noteId`)&&this._fetchRecord(this.noteId)}_delete(){confirm(`Delete this note?`)&&(this.dispatchEvent(new CustomEvent(`note-delete`,{detail:{id:this.noteId},bubbles:!0,composed:!0})),window.location.href=`/subway/`)}_startEdit(){this._editingTitle=!0,this.requestUpdate(),this.updateComplete.then(()=>{this.renderRoot.querySelector(`.title-input`)?.focus()})}_saveTitle(e){let t=e.target;this.text=t.value,this._editingTitle=!1,this.dispatchEvent(new CustomEvent(`note-changed`,{detail:{id:this.noteId,text:this.text,tasks:this._tasks},bubbles:!0,composed:!0}))}_onTitleKeyDown(e){(e.key===`Enter`||e.key===`Escape`)&&e.target.blur()}_onListChanged(e){let{tasks:t}=e.detail;this._tasks=t,this.dispatchEvent(new CustomEvent(`note-changed`,{detail:{id:this.noteId,text:this.text,tasks:t},bubbles:!0,composed:!0}))}render(){return t`
      ${this.type===`List`?t`
            <div class="list-header">
              <back-link></back-link>
              ${this._editingTitle?t`<input class="title-input" .value=${this.text} @blur=${this._saveTitle} @keydown=${this._onTitleKeyDown} />`:t`<span class="title-text">${this.text||`Untitled`}</span><button class="edit-btn" @click=${this._startEdit}>edit</button>`}
            </div>
            <list-item
              .noteId=${this.noteId}
              .tasks=${this._tasks}
              @list-changed=${this._onListChanged}
            ></list-item>
          `:t`
            <div class="note-header">
              <back-link></back-link>
            </div>
            <note-item
              .noteId=${this.noteId}
              .text=${this.text}
              .created_at=${this.created_at}
            ></note-item>
          `}
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `}};customElements.define(`edit-page`,o);