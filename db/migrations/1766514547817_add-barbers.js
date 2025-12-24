exports.up=(pgm)=>{
    pgm.createTable('barbers',{
        id:'id',
        organization_id:{
            type:'integer',
            notNull:true,
            references:'organizations',
            onDelete:'cascade',
        },
        user_id:{
            type:'integer',
            notNull:true,
            references:'users',
            onDelete:'cascade',

        },
        active:{
            type:'boolean',
            notNull:true,
            default:true,

        },
        created_at:{
            type:'timestamptz',
            default:pgm.func('now()'),

        },
        
    })

    pgm.addConstraint('barbers','barbers_user_unique',{
        unique:['organization_id','user_id'],
    })
}

exports.down=(pgm)=>{
    pgm.dropTable('barbers')
}
