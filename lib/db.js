const { dbConfig } = require("../config.js");
const knex = require("knex")({
  client: "mysql",
  connection: dbConfig
});

const bookshelf = require("bookshelf")(knex);
bookshelf.plugin(require("bookshelf-crud"));

const Record = bookshelf.model("Record", {
  tableName: "record",
  hasTimestamps: true
});
const Store = bookshelf.model("Store", {
  tableName: "store",
  hasTimestamps: false
});

module.exports = {
  Record,
  Store,
  knex,
  close: () => {
    knex.destroy();
  }
};
