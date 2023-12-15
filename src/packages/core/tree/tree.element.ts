import { UmbTreeContextBase } from './tree.context.js';
import { UmbTreeItemModelBase } from './types.js';
import { html, nothing, customElement, property, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import { UmbObserverController } from '@umbraco-cms/backoffice/observable-api';

import './tree-item-default/tree-item.element.js';
import './tree-item-base/tree-item-base.element.js';

@customElement('umb-tree')
export class UmbTreeElement extends UmbLitElement {
	@property({ type: String, reflect: true })
	get alias() {
		return this.#treeContext.getTreeAlias();
	}
	set alias(newVal) {
		this.#treeContext.setTreeAlias(newVal);
	}

	@property({ type: Boolean, reflect: true })
	get selectable() {
		return this.#treeContext.selection.getSelectable();
	}
	set selectable(newVal) {
		this.#treeContext.selection.setSelectable(newVal);
	}

	@property({ type: Array })
	get selection() {
		return this.#treeContext.selection.getSelection();
	}
	set selection(newVal) {
		if (!Array.isArray(newVal)) return;
		this.#treeContext?.selection.setSelection(newVal);
	}

	@property({ type: Boolean, reflect: true })
	get multiple() {
		return this.#treeContext.selection.getMultiple();
	}
	set multiple(newVal) {
		this.#treeContext.selection.setMultiple(newVal);
	}

	// TODO: what is the best name for this functionality?
	private _hideTreeRoot = false;
	@property({ type: Boolean, attribute: 'hide-tree-root' })
	get hideTreeRoot() {
		return this._hideTreeRoot;
	}
	set hideTreeRoot(newVal: boolean) {
		const oldVal = this._hideTreeRoot;
		this._hideTreeRoot = newVal;
		if (newVal === true) {
			this.#observeRootItems();
		}

		this.requestUpdate('hideTreeRoot', oldVal);
	}

	@property()
	get selectableFilter() {
		return this.#treeContext.selectableFilter;
	}
	set selectableFilter(newVal) {
		this.#treeContext.selectableFilter = newVal;
	}

	@state()
	private _items: UmbTreeItemModelBase[] = [];

	@state()
	private _treeRoot?: UmbTreeItemModelBase;

	#treeContext = new UmbTreeContextBase<UmbTreeItemModelBase>(this);

	#rootItemsObserver?: UmbObserverController<Array<UmbTreeItemModelBase>>;

	constructor() {
		super();
		this.#requestTreeRoot();
	}

	async #requestTreeRoot() {
		if (!this.#treeContext?.requestTreeRoot) throw new Error('Tree does not support root');

		const { data } = await this.#treeContext.requestTreeRoot();
		this._treeRoot = data;
	}

	async #observeRootItems() {
		if (!this.#treeContext?.requestRootItems) throw new Error('Tree does not support root items');
		this.#rootItemsObserver?.destroy();

		const { asObservable } = await this.#treeContext.requestRootItems();

		if (asObservable) {
			this.#rootItemsObserver = this.observe(asObservable(), (rootItems) => {
				const oldValue = this._items;
				this._items = rootItems;
				this.requestUpdate('_items', oldValue);
			});
		}
	}

	render() {
		return html` ${this.#renderTreeRoot()} ${this.#renderRootItems()}`;
	}

	#renderTreeRoot() {
		if (this.hideTreeRoot || this._treeRoot === undefined) return nothing;
		return html` <umb-tree-item-default .item=${this._treeRoot}></umb-tree-item-default> `;
	}

	#renderRootItems() {
		if (this._items?.length === 0) return nothing;
		return html`
			${repeat(
				this._items,
				// TODO: use unique here:
				(item, index) => item.name + '___' + index,
				(item) => html`<umb-tree-item-default .item=${item}></umb-tree-item-default>`,
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree': UmbTreeElement;
	}
}
