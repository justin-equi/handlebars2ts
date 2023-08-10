export type PickByType<T, Value> = {
	[P in keyof T as T[P] extends Value | undefined ? never : P]: T[P];
};
export type HasType = { type?: unknown };
