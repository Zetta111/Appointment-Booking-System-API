exports.up = (pgm) => {
    pgm.createTable('organizations',{
        id:'id',
        name:{type:'text',notNull:true},
        created_at:{type:'timestamptz',default:pgm.func('now()')},
    })

    pgm.createTable('users',{
        id:'id',
        organization_id:{
            type:'integer',
            notNull:true,
            references:'organizations',
            onDelete:'cascade',
        },
        email:{type:'text',notNull:true},
        password_hash:{type:'text',notNull:true},
        role:{type:'text',notNull:true},
        created_at:{type:'timestamptz',default:pgm.func('now()')},
        
    })

    pgm.addConstraint('users','users_org_email_unique',{
        unique:['organization_id','email'],
    })
}

exports.down = (pgm) => {
    pgm.dropTable('users')
    pgm.dropTable('organizations')
}

