export class NumberUtils {
	static padStart = (n: number, count: number, pad: string) => n.toString().padStart(count, pad);
	static padEnd = (n: number, count: number, pad: string) => n.toString().padEnd(count, pad);
}
