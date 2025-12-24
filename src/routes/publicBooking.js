const db=require('../db')

module.exports=async function(fastify){
    
    // Add hook to log incoming requests
    fastify.addHook('onRequest', async (request, reply) => {
        request.log.info({
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body
        }, 'Incoming request')
    })
    
     fastify.post('/:orgSlug/appointments', {
        schema: {
            body: {
                type: 'object',
                required: ['bookingToken', 'barberId', 'serviceId', 'startTime'],
                properties: {
                    bookingToken: { type: 'string' },
                    barberId: { type: 'integer' },
                    serviceId: { type: 'integer' },
                    startTime: { type: 'string' }
                }
            }
        }
     }, async (request,reply)=>{
        const{orgSlug}= request.params
        
        // Schema validation ensures all required fields are present
        const {bookingToken, barberId,serviceId,startTime}=request.body

        const client= await db.getClient()
        await client.query('BEGIN')
        
        try{
            // Query organization by name (orgSlug in URL should match organization name)
            const orgResg=await client.query(
                'SELECT id FROM organizations WHERE name = $1',
                [orgSlug]
            )
    
            if(orgResg.rowCount===0){
                await client.query('ROLLBACK')
                request.log.warn({ orgSlug }, 'Organization not found')
                return reply.code(404).send({error:'Organization not found', orgSlug})
            }


            const organizationId=orgResg.rows[0].id

            const tokenRes = await client.query(
                `
                SELECT id, expired_at, used_at
                FROM booking_tokens
                WHERE token = $1
                FOR UPDATE
                `,
                [bookingToken]
            )

            if(tokenRes.rowCount===0){
                await client.query('ROLLBACK')
                return reply.code(410).send({error:'Booking token invalid'})

            }
            const token=tokenRes.rows[0]
            
            if(token.used_at){
                await client.query('ROLLBACK')
                return reply.code(410).send({error:'Booking token already used'})
            }
            
            if(token.expired_at < new Date()){
                await client.query('ROLLBACK')
                return reply.code(410).send({error:'Booking token expired'})

            }

            const barberRes = await client.query(
                `
                SELECT id
                FROM barbers
                WHERE id = $1
                    AND organization_id = $2
                    AND active = true
                `,
                [barberId,organizationId]
            )

            if(barberRes.rowCount===0){
                await client.query('ROLLBACK')
                return reply.code(403).send({error:'Invalid barber'})
            }

            const servicesRes=await client.query(
                `
                SELECT duration_minutes
                FROM services
                WHERE id = $1
                    AND organization_id = $2
                    AND active = true
                `,
                [serviceId,organizationId]
            )
            if(servicesRes.rowCount===0){
                await client.query('ROLLBACK')
                return reply.code(403).send({error :'Invalid service'})
            }

            const durationMinutes= servicesRes.rows[0].duration_minutes
            const start = new Date(startTime)
            const end = new Date(start.getTime()+ durationMinutes*60000)

            try{
                await client.query(
                    `
                    INSERT INTO appointments(
                        organization_id,
                        barber_id,
                        service_id,
                        start_time,
                        end_time

                    )
                        VALUES ($1, $2, $3, $4, $5)
                    `,
                    [organizationId,barberId,serviceId,start,end]
                )
            }catch(err){
                if(err.constraint==='appointments_no_overlap'){
                    await client.query('ROLLBACK')
                    return reply.code(409).send({error:'Time slot unavailable'})
                }
                throw err
            }
        
            await client.query(
                `
                UPDATE booking_tokens
                SET used_at=now()
                WHERE id = $1
                
                `,
                [token.id]
            )
            await client.query('COMMIT')
            return reply.code(201).send({status:'booked'})


        }catch(err){
            await client.query('ROLLBACK').catch(() => {}) // Ignore rollback errors
            request.log.error({ err, message: err.message, stack: err.stack }, 'Error processing booking')
            return reply.code(500).send({
                error:'Internal server error',
                message: err.message,
                details: process.env.NODE_ENV === 'development' ? err.stack : undefined
            })
        }finally{
            client.release()
        }
    
    
    
    
})

        
    

    

}