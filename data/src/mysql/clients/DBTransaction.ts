import MysqlClientBase, { IMySQLTransaction } from "./base/MySqlClientBase";

export default class MysqlDBTransactionClient extends MysqlClientBase
  implements data.IDBTransactionClient {
  public async create<TReturn>(
    action: (dbTransaction: IMySQLTransaction) => Promise<TReturn>
  ): Promise<TReturn> {
    const dbTransaction = await this.beginTransaction();
    try {
      const response = await action(dbTransaction);
      await dbTransaction.end();
      return response;
    } catch (err) {
      await dbTransaction.connection.rollback();
      dbTransaction.connection.release();
      throw err;
    }
  }
}
