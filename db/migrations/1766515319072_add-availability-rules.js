exports.up=(pgm)=>{
    pgm.createTable('availability_rules',{
        id:'id',
        barber_id:{
            type:'integer',
            notNull:true,
            references:'barbers',
            onDelete:'cascade',
        },
        day_of_week:{
            type:'integer',
            notNull:true,
            check:'day_of_week BETWEEN 0 AND 6',
        },
        start_time:{
            type:'time',
            notNull:true,
        },
        end_time:{
            type:'time',
            notNull:true,
        },

    })

    pgm.addConstraint('availability_rules','availability_time_check',{
        check:'start_time < end_time',
    })

}

exports.down=(pgm)=>{
    pgm.dropTable('availability_rules')
}
