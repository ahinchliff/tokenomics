const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const config = require("../../.dev-db-migration-config.js");

const getMigrations = () => {
  const migrationDirectory = path.join(__dirname, "./mysql");
  const migrationFileNames = fs.readdirSync(migrationDirectory);
  return migrationFileNames
    .filter((fileName) => fileName.includes(".sql"))
    .map((fileName) => {
      const rawContent = fs.readFileSync(
        path.join(migrationDirectory, fileName),
        "utf8"
      );
      const content = rawContent.replace(/\r?\n|\r/g, " ").trim();

      return {
        fileName,
        content,
      };
    });
};

module.exports.runMigrations = async () => {
  const db = await mysql.createConnection(config.config);
  const migrations = getMigrations();

  console.log("DROPPING DB \n");
  await db.query("DROP DATABASE gotcha");

  for (const migration of migrations) {
    console.log(`RUNNING SCRIPT ${migration.fileName}\n`);
    const queries = migration.content
      .trim()
      .split(";")
      .map((q) => `${q};`.trim())
      .filter((q) => q.length > 1);
    for (const query of queries) {
      try {
        console.log(query);
        await db.query(query);
      } catch (e) {
        console.log(e);
      }
    }
    console.log("\n");
  }
  console.log("FINISHED");
};
