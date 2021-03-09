import MySQLClientBase from "./MySqlClientBase";
import {
  select,
  deleteFrom,
  insert,
  update,
  SelectStatement,
} from "sql-bricks";
import * as sql from "sql-bricks";
import { Pool, RowDataPacket } from "mysql2/promise";
import { prepareObjectForSql } from "../utils";

const sqlAsAny: any = sql;
sqlAsAny._autoQuoteChar = "`";
sqlAsAny.setDefaultOpts({ placeholder: "?" });

export default class EntityClientBase<
  Table extends keyof data.ITables,
  Entity,
  NewEntity
> extends MySQLClientBase {
  constructor(
    protected tableName: Table,
    pool: Pool,
    logger: core.backend.Logger,
    logValues: boolean,
    private mapper: (row: RowDataPacket) => Entity,
    private primaryKey:
      | keyof data.ITables[Table]
      | Array<keyof data.ITables[Table]>
  ) {
    super(pool, logger, logValues);
  }

  public async create(
    data: NewEntity,
    transactionConnection?: data.IDBTransaction
  ): Promise<Entity> {
    const sqlStatement = insert(
      this.tableName,
      prepareObjectForSql(this.tableName, data)
    );

    const { insertId } = await this.mutate(sqlStatement, transactionConnection);

    const getWith = Array.isArray(this.primaryKey)
      ? this.primaryKey.reduce(
          (previous: {}, value: keyof data.ITables[Table]) => {
            return {
              ...previous,
              [value]: data[value as keyof NewEntity],
            };
          },
          {}
        )
      : (({ [this.primaryKey]: insertId } as unknown) as Partial<Entity>);

    return (this.get(getWith, transactionConnection) as unknown) as Entity;
  }

  public async createMany(
    data: NewEntity[],
    transactionConnection?: data.IDBTransaction
  ): Promise<number> {
    if (data.length < 1) {
      return -1;
    }

    const sqlStatement = insert(
      this.tableName,
      data.map((d) => prepareObjectForSql(this.tableName, d))
    );

    const { insertId } = await this.mutate(sqlStatement, transactionConnection);

    return insertId;
  }

  public async delete(
    where: Partial<Entity>,
    transactionConnection?: data.IDBTransaction
  ): Promise<{ success: boolean }> {
    const sqlStatement = deleteFrom(this.tableName).where(
      prepareObjectForSql(this.tableName, where)
    );

    const result = await this.mutate(sqlStatement, transactionConnection);

    return { success: result.affectedRows >= 1 };
  }

  public async update(
    where: Partial<Entity>,
    data: Partial<Entity>,
    transactionConnection?: data.IDBTransaction
  ): Promise<Entity> {
    const statement = update(this.tableName)
      .set(prepareObjectForSql(this.tableName, data))
      .where(prepareObjectForSql(this.tableName, where));

    await this.mutate(statement, transactionConnection);

    return (this.get(where, transactionConnection) as any) as Entity;
  }

  public async get(
    where: Partial<Entity>,
    transactionConnection?: data.IDBTransaction
  ): Promise<Entity | undefined> {
    const statement = select()
      .from(this.tableName)
      .where(prepareObjectForSql(this.tableName, where));

    return this.queryOne(statement, transactionConnection);
  }

  public async getMany(
    where: Partial<Entity>,
    transactionConnection?: data.IDBTransaction
  ): Promise<Entity[]> {
    const statement = select()
      .from(this.tableName)
      .where(prepareObjectForSql(this.tableName, where));

    return this.queryMany(statement, transactionConnection);
  }

  protected queryOne = async (
    statement: SelectStatement,
    transactionConnection?: data.IDBTransaction
  ): Promise<Entity | undefined> => {
    const [resultSet] = await this.query(statement, transactionConnection);

    if (!resultSet[0]) {
      return undefined;
    }

    return this.mapper(resultSet[0]);
  };

  protected queryMany = async (
    statement: SelectStatement,
    transactionConnection?: data.IDBTransaction,
    limit?: number
  ): Promise<Entity[]> => {
    const [resultSet] = await this.query(
      statement,
      transactionConnection,
      limit
    );

    return resultSet.map(this.mapper);
  };
}
