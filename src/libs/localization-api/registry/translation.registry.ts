import { hasDefaultExport, loadExtension } from '@umbraco-cms/backoffice/extension-api';
import { UmbBackofficeExtensionRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { ReplaySubject, Subscription } from '@umbraco-cms/backoffice/external/rxjs';

export type UmbTranslationDictionary = Map<string, string>;

export class UmbTranslationRegistry {
	#extensionRegistry;
	#innerDictionary = new ReplaySubject<UmbTranslationDictionary>(1);
	#innerDictionaryValue: UmbTranslationDictionary = new Map();
	#subscription?: Subscription;

	constructor(umbExtensionRegistry: UmbBackofficeExtensionRegistry) {
		this.#extensionRegistry = umbExtensionRegistry;
	}

	get translations() {
		return this.#innerDictionary.asObservable();
	}

	register(userCulture: string, fallbackCulture = 'en_us') {
		userCulture = userCulture.toLowerCase();
		fallbackCulture = fallbackCulture.toLowerCase();

		// Reset the inner dictionary.
		this.#innerDictionaryValue = new Map();

		// Cancel any previous subscription.
		if (this.#subscription) {
			this.#subscription.unsubscribe();
		}

		// Load new translations
		this.#subscription = this.#extensionRegistry.extensionsOfType('translations').subscribe(async (extensions) => {
			await Promise.all(
				extensions
					.filter((x) => x.meta.culture === userCulture || x.meta.culture === fallbackCulture)
					.map(async (extension) => {
						// If extension contains a dictionary, add it to the inner dictionary.
						if (extension.meta.translations) {
							for (const [dictionaryName, dictionary] of Object.entries(extension.meta.translations)) {
								this.#addOrUpdateDictionary(dictionaryName, dictionary);
							}
							return;
						}

						// If extension contains a js file, load it and add the default dictionary to the inner dictionary.
						const loadedExtension = await loadExtension(extension);

						if (loadedExtension && hasDefaultExport(loadedExtension)) {
							for (const [dictionaryName, dictionary] of Object.entries(loadedExtension.default)) {
								this.#addOrUpdateDictionary(dictionaryName, dictionary);
							}
						}
					})
			);

			// Notify subscribers that the inner dictionary has changed.
			if (this.#innerDictionaryValue.size > 0) {
				this.#innerDictionary.next(this.#innerDictionaryValue);
			}
		});
	}

	#addOrUpdateDictionary(dictionaryName: string, dictionary: Record<string, string>) {
		for (const [key, value] of Object.entries(dictionary)) {
			this.#innerDictionaryValue.set(`${dictionaryName}_${key}`, value);
		}
	}
}
