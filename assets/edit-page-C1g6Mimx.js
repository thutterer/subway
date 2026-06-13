import{a as e,c as t,i as n,l as r,o as i,r as a,s as o,t as s,u as c}from"./index-BkHQ0ExB.js";import"./back-link-B-L5DXZP.js";var l={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},u=e=>(...t)=>({_$litDirective$:e,values:t}),d=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},f=class extends d{constructor(e){if(super(e),this.it=i,e.type!==l.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===i||e==null)return this._t=void 0,this.it=e;if(e===o)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};f.directiveName=`unsafeHTML`,f.resultType=1;var p=u(f);function m(e){let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).split(`
`),n=[],r=!1;for(let e of t){if(/^```/.test(e)){r=!r,n.push(`<span class="md-fence">${e}</span>`);continue}if(r){n.push(`<span class="md-fence">${e}</span>`);continue}if(/^#{1,6}\s/.test(e)){let t=e.match(/^(#+)/)[1].length;n.push(`<span class="md-h${t}">${e}</span>`);continue}if(/^\s*>/.test(e)){n.push(`<span class="md-blockquote">${e}</span>`);continue}if(/^(?:---|\*\*\*|___)\s*$/.test(e)){n.push(`<span class="md-hr">${e}</span>`);continue}if(/^\s*[-*+]\s/.test(e)){n.push(`<span class="md-list">${e}</span>`);continue}if(/^\s*\d+\.\s/.test(e)){n.push(`<span class="md-list">${e}</span>`);continue}n.push(h(e))}return n.join(`
`)}function h(e){return e.replace(/`([^`\n]+)`/g,'<span class="md-code">`$1`</span>').replace(/\*\*(.*?)\*\*/g,`<span class="md-bold">**$1**</span>`).replace(/__(.*?)__/g,`<span class="md-bold">__$1__</span>`).replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,`<span class="md-italic">*$1*</span>`).replace(/(?<!_)_([^_\n]+)_(?!_)/g,`<span class="md-italic">_$1_</span>`).replace(/~~(.*?)~~/g,`<span class="md-strike">~~$1~~</span>`).replace(/\[([^\]]+)\]\(([^)]+)\)/g,`<span class="md-link">[$1]($2)</span>`).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,`<span class="md-image">![$1]($2)</span>`)}var g=class extends e{static{this.properties={blockIndex:{},text:{type:String}}}static{this.styles=r`
    .editor-wrapper {
      display: grid;
      border: 1px solid var(--border-light);
      min-height: 30vh;
    }
    .editor-wrapper > * {
      grid-area: 1 / 1 / 2 / 2;
    }
    .backdrop {
      pointer-events: none;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      margin: 0;
      padding: 4px;
      font-family: inherit;
      font-size: 1rem;
      line-height: inherit;
      tab-size: 2;
      color: var(--text-strong);
    }
    textarea {
      background: transparent;
      border: none;
      resize: none;
      overflow: hidden;
      font-family: inherit;
      font-size: 1rem;
      line-height: inherit;
      padding: 4px;
      tab-size: 2;
      color: transparent;
      caret-color: var(--text-strong);
      -webkit-text-fill-color: transparent;
      outline: none;
    }
    textarea::placeholder {
      color: var(--text-muted);
      -webkit-text-fill-color: var(--text-muted);
    }

    .md-h1 { color: #e8c547; }
    .md-h2 { color: #d4a843; }
    .md-h3 { color: #c08a3f; }
    .md-h4, .md-h5, .md-h6 { color: #ac6c3c; }
    .md-bold { color: var(--text-strong); }
    .md-italic { color: #8ab4f8; }
    .md-strike {
      color: var(--text-muted);
      text-decoration: line-through;
    }
    .md-code {
      background: rgba(128, 128, 128, 0.15);
      color: #e06c75;
      border-radius: 3px;
    }
    .md-link { color: var(--brand-color); }
    .md-image { color: var(--brand-color); }
    .md-blockquote { color: var(--text-subtle); }
    .md-list { color: #56b6c2; }
    .md-hr { color: var(--text-muted); }
    .md-fence {
      background: rgba(128, 128, 128, 0.15);
      color: #e06c75;
    }
  `}_onInput(e){let t=e.target.value;this.dispatchEvent(new CustomEvent(`block-changed`,{bubbles:!0,composed:!0,detail:{blockIndex:this.blockIndex,markdown:t}}))}render(){return t`
      <div class="editor-wrapper">
        <div class="backdrop" aria-hidden="true">${p(m(this.text))}</div>
        <textarea
          .value=${this.text}
          @input=${this._onInput}
          placeholder="Start typing...">
        </textarea>
      </div>
    `}};customElements.define(`note-item`,g);var _=class extends e{constructor(...e){super(...e),this.tasks=[]}static{this.properties={noteId:{},blockIndex:{},tasks:{type:Array}}}static{this.styles=r`
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
      font-size: 1rem;
      padding: 0.25rem;
      border: 1px solid var(--border-light);
      background: transparent;
    }
    .add-row input:focus {
      outline: none;
      border-color: var(--brand-color, wheat);
    }
  `}_addTask(){let e=this.renderRoot.querySelector(`input`),t=e.value.trim();t&&(this.tasks=[...this.tasks,{id:crypto.randomUUID(),text:t,done:!1}],e.value=``,this._dispatch())}_onKeyDown(e){e.key===`Enter`&&this._addTask()}_onPaste(e){e.preventDefault();let t=e.clipboardData?.getData(`text`);if(!t)return;let n=t.split(`
`).map(e=>e.trim()).filter(Boolean);if(n.length===0||n.length>1&&!confirm(`${n.length} items will be added`))return;for(let e of n)this.tasks=[...this.tasks,{id:crypto.randomUUID(),text:e,done:!1}];this._dispatch();let r=this.renderRoot.querySelector(`input`);r.value=``}_toggleTask(e){this.tasks=this.tasks.map(t=>t.id===e?{...t,done:!t.done}:t),this._dispatch()}_deleteTask(e,t){e.stopPropagation(),this.tasks=this.tasks.filter(e=>e.id!==t),this._dispatch()}_dispatch(){this.dispatchEvent(new CustomEvent(`list-changed`,{detail:{id:this.noteId,blockIndex:this.blockIndex,tasks:this.tasks},bubbles:!0,composed:!0}))}render(){let e=this.tasks.filter(e=>e.done).length;return t`
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
            @paste=${this._onPaste}
            placeholder="Add item..."
          />
          <button class="delete" @click=${this._addTask}>+</button>
        </div>
      </div>
    `}};customElements.define(`list-item`,_);var v=class extends e{static{this.styles=r`
    :host {
      display: block;
      padding: 1rem 0;
    }
    hr {
      border: none;
      border-top: 2px dashed var(--border-light);
      margin: 0;
    }
  `}render(){return t`<hr>`}};customElements.define(`divider-item`,v);var y=class extends e{constructor(...e){super(...e),this.noteId=``,this.title=``,this._blocks=[],this._editing=!1,this._openInserter=null}static{this.properties={noteId:{},title:{type:String},_blocks:{state:!0},_editing:{state:!0},_openInserter:{state:!0}}}static{this.styles=r`
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .title-text {
      font-size: 1.5rem;
    }
    .title-input {
      flex: 1;
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
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .edit-btn:hover {
      color: var(--text-strong);
    }

    .block-btn {
      background: none;
      border: 1px solid var(--border-light);
      cursor: pointer;
      font-size: 0.75rem;
      padding: 2px 6px;
      color: var(--text-muted);
      line-height: 1;
    }
    .block-btn:hover {
      color: var(--text-strong);
      border-color: var(--text-muted);
    }

    .block-group {
      position: relative;
      transition: background 0.2s;
      border-radius: 2px;
      padding: 0.125rem 0;
    }
    .block-group:hover {
      background: rgba(128, 128, 128, 0.06);
    }

    .block-actions {
      display: flex;
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      z-index: 1;
    }

    @media (hover: hover) {
      .block-actions {
        opacity: 0;
      }
      .block-group:hover .block-actions {
        opacity: 1;
      }
    }

    .inserter {
      display: flex;
      justify-content: center;
      padding: 0.25rem 0;
    }

    .ins-pill {
      opacity: 0.4;
      transition: opacity 0.15s;
      font-size: 0.7rem;
      padding: 1px 8px;
    }
    .inserter:hover .ins-pill {
      opacity: 0.8;
    }

    @media (hover: hover) {
      .ins-pill {
        opacity: 0;
      }
      .inserter:hover .ins-pill {
        opacity: 0.4;
      }
    }

    .ins-expanded {
      display: flex;
      gap: 0.5rem;
    }

    .footer {
      display: flex;
      justify-content: center;

      .delete {
        margin-top: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.75rem;
        color: var(--text-muted);

        &:hover {
          color: var(--text-strong);
        }
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.noteId&&this._subscribe(this.noteId)}disconnectedCallback(){super.disconnectedCallback(),this._sub?.unsubscribe()}_subscribe(e){this._sub?.unsubscribe(),this._sub=c(()=>s.docs.get(e)).subscribe({next:e=>{e&&(this.title=e.title??``,this._blocks=e.blocks)}})}willUpdate(e){e.has(`noteId`)&&(this._editing=!1,this._subscribe(this.noteId))}async _delete(){confirm(`Delete this note?`)&&(await a(this.noteId),this.dispatchEvent(new CustomEvent(`navigate`,{bubbles:!0,composed:!0,detail:{path:``}})))}_startEdit(){this._editing=!0,this.updateComplete.then(()=>{this.renderRoot.querySelector(`.title-input`)?.focus()})}async _save(e){let t=e.target;this.title=t.value,this._editing=!1,await n(this.noteId,{title:this.title})}_onKeyDown(e){(e.key===`Enter`||e.key===`Escape`)&&e.target.blur()}async _onBlockChanged(e){let{blockIndex:t,markdown:r}=e.detail,i=this._blocks.map((e,n)=>n===t?{...e,markdown:r}:e);await n(this.noteId,{blocks:i})}async _onListChanged(e){let{blockIndex:t,tasks:r}=e.detail;this._blocks=this._blocks.map((e,n)=>n===t?{...e,items:r}:e),await n(this.noteId,{blocks:this._blocks})}_toggleInserter(e){this._openInserter=this._openInserter===e?null:e}_insertBlock(e,t){let r;r=t===`list`?{type:`list`,items:[]}:t===`divider`?{type:`divider`}:{type:`text`,markdown:``},this._blocks=[...this._blocks.slice(0,e),r,...this._blocks.slice(e)],this._openInserter=null,n(this.noteId,{blocks:this._blocks})}async _deleteBlock(e){confirm(`Delete this block?`)&&(this._blocks=this._blocks.filter((t,n)=>n!==e),await n(this.noteId,{blocks:this._blocks}))}_renderInserter(e){return t`
			<div class="inserter">
				${this._openInserter===e?t`
						<div class="ins-expanded">
							<button class="block-btn" @click=${()=>this._insertBlock(e,`text`)}>Text</button>
							<button class="block-btn" @click=${()=>this._insertBlock(e,`list`)}>List</button>
							<button class="block-btn" @click=${()=>this._insertBlock(e,`divider`)}>---</button>
						</div>
					`:t`
						<button class="block-btn ins-pill" @click=${()=>this._toggleInserter(e)}>+</button>
					`}
			</div>
		`}_renderBlock(e,n){let r=t``;return r=e.type===`list`?t`
				<list-item
					.noteId=${this.noteId}
					.blockIndex=${n}
					.tasks=${e.items}
					@list-changed=${this._onListChanged}
				></list-item>
			`:e.type===`divider`?t`<divider-item></divider-item>`:t`
				<note-item
					.blockIndex=${n}
					.text=${e.markdown}
					@block-changed=${this._onBlockChanged}
				></note-item>
			`,t`
			${r}
			<div class="block-actions">
				<button class="block-btn" @click=${()=>this._deleteBlock(n)}>
					-
				</button>
			</div>
		`}render(){return t`
      <div class="header">
        <back-link></back-link>
        ${this._editing?t`<input class="title-input" .value=${this.title} @blur=${this._save} @keydown=${this._onKeyDown} />`:t`<span class="title-text">${this.title||`Untitled`}</span><button class="edit-btn" @click=${this._startEdit}>edit</button>`}
      </div>
      ${this._renderInserter(0)}
      ${this._blocks.map((e,n)=>t`
        <div class="block-group">
          ${this._renderBlock(e,n)}
        </div>
        ${this._renderInserter(n+1)}
      `)}
      <div class="footer">
        <button class="delete" @click=${this._delete}>delete</button>
      </div>
    `}};customElements.define(`edit-page`,y);