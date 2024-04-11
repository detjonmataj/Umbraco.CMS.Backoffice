import type { UmbSearchProvider, UmbSearchRequestArgs } from '@umbraco-cms/backoffice/search';
import type { UmbDocumentTypeItemModel } from '../index.js';
import { UmbDocumentTypeSearchRepository } from './document-type-search.repository.js';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';

export interface UmbDocumentTypeSearchItemModel extends UmbDocumentTypeItemModel {}

export class UmbDocumentTypeSearchProvider
	extends UmbControllerBase
	implements UmbSearchProvider<UmbDocumentTypeSearchItemModel>
{
	#repository = new UmbDocumentTypeSearchRepository(this);

	async search(args: UmbSearchRequestArgs) {
		return this.#repository.search(args);
	}

	destroy(): void {
		this.#repository.destroy();
	}
}

export { UmbDocumentTypeSearchProvider as api };
