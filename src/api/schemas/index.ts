import Ajv from 'ajv'
import fs from 'fs'
import path from 'path'
import {logger} from '../../loaders'

const entries = assignAllJson(__dirname, [])
const defaultAjv = new Ajv({
  schemas: entries,
  useDefaults: true,
  removeAdditional: true,
  coerceTypes: 'array',
  nullable: true
})

function getReferences(obj, ref) {
  const ret = []
  Object.entries(obj).forEach(([key, value]) => {
    if (obj[key] instanceof Object) ret.push(...getReferences(obj[key], ref))
    else if (key === ref) ret.push(obj[key])
  })
  return ret
}

function assignAllJson(dir, all): any {
  try {
    fs.readdirSync(dir).forEach((target) => {
      const targetDir = path.join(dir, target)
      if (fs.statSync(targetDir).isDirectory()) {
        assignAllJson(targetDir, all)
      } else if (target.endsWith('.json')) {
        const key = targetDir.replace(`${__dirname}/`, '').replace('.json', '')
        const file = fs.readFileSync(path.join(__dirname, `${key}.json`))
        const schema = JSON.parse(file.toString())
        schema.$id = key
        const refs = getReferences(schema, '$ref')
        schema.components = {schemas: {}}
        refs.forEach((ref) => {
          if (ref.startsWith('#/components/schemas/')) {
            const refId = ref.replace('#/components/schemas/', '').replace(/~0/g, '~').replace(/~1/g, '/')
            schema.components.schemas[refId] = getSchema(refId)
          }
        })
        all.push(schema)
      }
    })
  } catch (e) {
    logger.fatal(e)
  }
  return all
}

function getSchema(id: string): any {
  const file = fs.readFileSync(path.join(__dirname, `${id}.json`))
  return JSON.parse(file.toString())
}

function getSchemas(source: string): any[] {
  return [
    ...assignAllJson(path.join(__dirname, 'requests', source), []),
    ...assignAllJson(path.join(__dirname, 'responses', source), []),
    ...assignAllJson(path.join(__dirname, 'common'), [])
  ]
}

function validate(data: Dictionary, schema: string, options?: Dictionary): any {
  const validate = defaultAjv.getSchema(schema)
  if (!validate) throw new Error('undefined_schema')

  if (!validate(data)) {
    throw new Error(defaultAjv.errorsText(validate.errors))
  }
}

export {getSchema, getSchemas, validate}
