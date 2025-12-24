exports.up=(pgm)=>{
    pgm.createTable('services',{
        id:'id',

        organization_id:{
            type:'integer',
            notNull:true,
            references:'organizations',
            onDelete:'cascade',
        },
        name:{
            type:'text',
            notNull:true
        },
        duration_minutes:{
            type:'integer',
            notNull:true,
            check:'duration_minutes > 0',
        },
        price_cents:{
            type:'integer',
            notNull:true,
            check:'price_cents > 0',
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
    pgm.addConstraint('services','services_org_name_unique',{
        unique:['organization_id','name'],
    })
}

exports.down=(pgm)=>{
    pgm.dropTable('services')
}