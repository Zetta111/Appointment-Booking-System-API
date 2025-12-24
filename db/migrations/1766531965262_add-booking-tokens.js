exports.up=(pgm)=>{
    pgm.createTable('booking_tokens',{
        id:'id',

        organization_id:{
            type:'integer',
            notNull:true,
            reference:'organizations',
            onDelete:'cascade',
        },
        token:{
            type:'text',
            notNull:true,
            unique:true,
        },
        expired_at:{
            type:'timestamptz',
            notNull:true,
        },

        used_at:{
            type:'timestamptz'
        },
        created_at:{
            type:'timestamptz',
            default:pgm.func('now()')
        },
    })

    pgm.createIndex('booking_tokens','token')
}

exports.down=(pgm)=>{
    pgm.dropTable('booking_tokens')
}
