import * as aws from './aws'
import * as logger from './logger'
import * as mysql from './mysql'
import express from './express'

export async function init(): Promise<void> {
  await Promise.all([mysql.init()])
}

export {aws, logger, mysql as db, express}
