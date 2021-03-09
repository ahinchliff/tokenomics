type ColumnName<T extends keyof data.ITables> = keyof data.ITables[T] | "*";

export const table = (t: keyof data.ITables): string => t;

const prefixColumnWithTableName = <T extends keyof data.ITables>(
  table: T,
  column: ColumnName<T>
): ColumnName<T> => `${table}_${column}` as ColumnName<T>;

export const column = <T extends keyof data.ITables>(t: T) => (
  columns: Array<keyof data.ITables[T]> | ColumnName<T>
): Array<ColumnName<T>> => {
  if (Array.isArray(columns)) {
    return columns.map((c) => prefixColumnWithTableName(t, c));
  }

  return [prefixColumnWithTableName(t, columns)];
};

export const columns = <T extends keyof data.ITables>(t: T) => (
  where: Partial<
    {
      [K in keyof data.ITables[T]]: any;
    }
  >
) => {
  return prepareObjectForSql(t, where);
};

export const on = <T extends keyof data.ITables, K extends keyof data.ITables>(
  t: T,
  k: K,
  column: keyof data.ITables[T] & keyof data.ITables[K]
) => ({
  [prefixColumnWithTableName(t, column)]: prefixColumnWithTableName(k, column),
});

export function using<
  T extends keyof data.ITables,
  K extends keyof data.ITables
>(column: keyof data.ITables[T] & keyof data.ITables[K]): string {
  return column as string;
}

export const rowExtractor = <T extends keyof data.ITables>(t: T, row: any) => (
  column: keyof data.ITables[T]
) => row[prefixColumnWithTableName(t, column)];

export const numberBooleanToBoolean = (
  value: null | undefined | 1 | 0
): boolean => value === 1;

export const prepareObjectForSql = (table: keyof data.ITables, object: any) => {
  const result: any = {};
  const noUndefined = removeUndefinedFromTopLayerOfObject(object);
  for (let prop in noUndefined) {
    if (Object.prototype.hasOwnProperty.call(noUndefined, prop)) {
      const rawValue = noUndefined[prop];
      const value =
        typeof rawValue === "object" && !(rawValue instanceof Date)
          ? JSON.stringify(rawValue)
          : rawValue;
      result[prefixColumnWithTableName(table, prop as any)] = value;
    }
  }

  return result;
};

const removeUndefinedFromTopLayerOfObject = <T>(value: T): T => {
  const cleansed = {
    ...value,
  };
  for (const key in cleansed) {
    if (cleansed[key] === undefined) {
      delete cleansed[key];
    }
  }
  return cleansed;
};
