import type { UmbInputCheckboxListElement } from './components/input-checkbox-list/input-checkbox-list.element.js';
import { html, customElement, property, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';

import './components/input-checkbox-list/input-checkbox-list.element.js';

/**
 * @element umb-property-editor-ui-checkbox-list
 */
@customElement('umb-property-editor-ui-checkbox-list')
export class UmbPropertyEditorUICheckboxListElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	#selection: Array<string> = [];

	@property({ type: Array })
	public set value(value: Array<string> | string | undefined) {
		this.#selection = Array.isArray(value) ? value : value ? [value] : [];
	}
	public get value(): Array<string> | undefined {
		return this.#selection;
	}

	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		if (!config) return;

		const items = config.getValueByAlias('items');

		if (Array.isArray(items) && items.length > 0) {
			this._list =
				typeof items[0] === 'string'
					? items.map((item) => ({ label: item, value: item, checked: this.#selection.includes(item) }))
					: items.map((item) => ({
							label: item.name,
							value: item.value,
							checked: this.#selection.includes(item.value),
						}));
		}
	}

	@state()
	private _list: UmbInputCheckboxListElement['list'] = [];

	#onChange(event: CustomEvent & { target: UmbInputCheckboxListElement }) {
		this.value = event.target.selection;
		this.dispatchEvent(new UmbPropertyValueChangeEvent());
	}

	render() {
		return html`
			<umb-input-checkbox-list
				.list=${this._list}
				.selection=${this.#selection}
				@change=${this.#onChange}></umb-input-checkbox-list>
		`;
	}
}

export default UmbPropertyEditorUICheckboxListElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-checkbox-list': UmbPropertyEditorUICheckboxListElement;
	}
}
