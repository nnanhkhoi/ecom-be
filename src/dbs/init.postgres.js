const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('../configs/config')

const sequelize = new Sequelize(DATABASE_URL)

const migrationConf = {
  migrations: {
    glob: 'src/migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

//Singleton connection
class Database {
  constructor() {
    this.connect()
  }

  runMigrations = async () => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
      files: migrations.map((mig) => mig.name),
    })
  }

  //connect
  async connect(type = 'postgres') {
    try {
      await sequelize.authenticate()
      await this.runMigrations()
      console.log('database connected')
    } catch (err) {
      console.log(err)
      console.log('connecting database failed')
      return process.exit(1)
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const instancePostgresDb = Database.getInstance()

module.exports = {
  sequelize,
  rollbackMigration,
  instancePostgresDb,
}
