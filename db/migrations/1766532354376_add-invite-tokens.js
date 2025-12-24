exports.up=(pgm)=>{
    pgm.createTable('invite_tokens',{
        id:'id',
        organization_id:{
            type:'integer',
            notNull:true,
            reference:'organizations',
            onDelete:'cascade'
        },
        email:{
            type:'text',
            notNull:true
        },
        token:{
            type:'text',
            notNull:true,
            unique:true

        },

        expires_at:{
            type:'timestamptz',
            notNull:true,

        },
        used_at:{
            type:'timestamptz'
        },
        created_at:{
            type:'timestamptz',
            default:pgm.func('now()'),
        }

    })

    pgm.createIndex('invite_tokens','token')

}

exports.down=(pgm)=>{
    pgm.dropTable('invite_tokens')
}