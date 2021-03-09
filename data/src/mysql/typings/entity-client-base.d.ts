declare namespace data {
  interface EntityClientBase<ColumnShape, New, Return> {
    create(data: New, t?: data.IDBTransaction): Promise<Return>;
    createMany(data: New[], t?: data.IDBTransaction): Promise<number>;
    delete(
      where: Partial<ColumnShape>,
      t?: data.IDBTransaction
    ): Promise<{ success: boolean }>;
    update(
      where: Partial<ColumnShape>,
      data: Partial<ColumnShape>,
      t?: data.IDBTransaction
    ): Promise<Return>;
    get(
      where: Partial<ColumnShape>,
      t?: data.IDBTransaction
    ): Promise<Return | undefined>;
    getMany(
      where: Partial<ColumnShape>,
      t?: data.IDBTransaction
    ): Promise<Return[]>;
  }
}
