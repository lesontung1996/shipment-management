/**
 * Pure helpers for reading and writing typed URL search params.
 * Pair with `useQueryParams` for React, or call these directly in tests / non-React code.
 */

export type QueryParamCodec<T> = {
  parse: (raw: string | null) => T;
  /** Return `null` to omit the key from the URL. */
  serialize: (value: T) => string | null;
};

// `any` keeps codecs of different value types assignable to one schema object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryParamSchema = Record<string, QueryParamCodec<any>>;

export type InferQueryParams<T extends QueryParamSchema> = {
  [K in keyof T]: T[K] extends QueryParamCodec<infer V> ? V : never;
};

export type SearchParamsLike = {
  get: (name: string) => string | null;
};

export function stringParam(defaultValue = ""): QueryParamCodec<string> {
  return {
    parse: (raw) => raw ?? defaultValue,
    serialize: (value) => {
      const trimmed = value?.trim();
      if (!trimmed || trimmed === defaultValue) return null;
      return trimmed;
    },
  };
}

export function optionalStringParam(): QueryParamCodec<string | null> {
  return {
    parse: (raw) => {
      if (raw == null || raw === "") return null;
      return raw;
    },
    serialize: (value) => (value ? value : null),
  };
}

export function enumParam<T extends string>(
  values: readonly T[],
  defaultValue: T
): QueryParamCodec<T> {
  const allowed = new Set<string>(values);
  return {
    parse: (raw) => {
      if (raw != null && allowed.has(raw)) return raw as T;
      return defaultValue;
    },
    serialize: (value) => (value === defaultValue ? null : value),
  };
}

export function readQueryParams<T extends QueryParamSchema>(
  searchParams: SearchParamsLike,
  schema: T
): InferQueryParams<T> {
  const result = {} as InferQueryParams<T>;
  for (const key of Object.keys(schema) as (keyof T & string)[]) {
    result[key] = schema[key].parse(searchParams.get(key)) as InferQueryParams<T>[typeof key];
  }
  return result;
}

/**
 * Returns a new `URLSearchParams` with `updates` applied.
 * Keys serialize to `null` are removed. Unrelated existing params are preserved.
 */
export function applyQueryParamUpdates<T extends QueryParamSchema>(
  searchParams: SearchParamsLike & { toString?: () => string },
  schema: T,
  updates: Partial<InferQueryParams<T>>
): URLSearchParams {
  const next = new URLSearchParams(
    typeof searchParams.toString === "function"
      ? searchParams.toString()
      : undefined
  );

  for (const key of Object.keys(updates) as (keyof T & string)[]) {
    if (!(key in schema)) continue;
    const value = updates[key];
    if (value === undefined) continue;

    const serialized = schema[key].serialize(value);
    if (serialized == null) {
      next.delete(key);
    } else {
      next.set(key, serialized);
    }
  }

  return next;
}

export function buildPathWithQuery(
  pathname: string,
  searchParams: URLSearchParams
): string {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
