import * as aws from './aws'
import * as logger from './logger'
import * as mysql from './mysql'
import * as mailer from './mailer'
import express from './express'
import * as google from './social/google'
import * as kakao from './social/kakao'


export async function init(): Promise<void> {
  await Promise.all([mysql.init()])
}

export {aws, logger, mailer, mysql as db, express, google as Google, kakao as Kakao}
