import type { Meta, Story } from '@storybook/web-components';
import type { UmbPropertyEditorUIBlockGridColumnSpanElement } from './property-editor-ui-block-grid-column-span.element.js';
import { html } from '@umbraco-cms/backoffice/external/lit';

import './property-editor-ui-block-grid-column-span.element.js';

export default {
	title: 'Property Editor UIs/Block Grid Column Span',
	component: 'umb-property-editor-ui-block-grid-column-span',
	id: 'umb-property-editor-ui-block-grid-column-span',
} as Meta;

export const AAAOverview: Story<UmbPropertyEditorUIBlockGridColumnSpanElement> = () =>
	html` <umb-property-editor-ui-block-grid-column-span></umb-property-editor-ui-block-grid-column-span>`;
AAAOverview.storyName = 'Overview';
