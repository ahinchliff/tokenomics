declare namespace data {
  interface IDBTransaction {
    end: () => Promise<void>;
    connection: any;
  }

  interface IDBTransactionClient {
    create<T>(
      action: (dbTransaction: data.IDBTransaction) => Promise<T>
    ): Promise<T>;
  }
}
