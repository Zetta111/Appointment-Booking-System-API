// Load environment variables
require('dotenv').config()

const fastify = require('fastify')({ 
  logger: true,
  bodyLimit: 1048576 // 1MB
})

// Allow empty JSON bodies
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    if (body === '' || body === null || body === undefined) {
      done(null, {})
    } else {
      const json = JSON.parse(body)
      done(null, json)
    }
  } catch (err) {
    err.statusCode = 400
    done(err, undefined)
  }
})

fastify.get('/health', async () => {
  return { status: 'ok' }
})

fastify.register(require('./routes/publicBooking'),{
  prefix:'/public',
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}



start()
