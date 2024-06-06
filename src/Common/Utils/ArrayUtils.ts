export class ArrayUtils {
	static groupBy<T>(data: T[], selector: (e: T) => string) {
		const store: { [index: string]: T[] } = {};
		data.forEach(x => {
			const key = selector(x);
			if (store[key] == null) {
				store[key] = [];
			}
			store[key].push(x);
		});
		return store;
	}
}