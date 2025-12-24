exports.up = (pgm) => {
    // Required for EXCLUDE constraints on ranges
    pgm.createExtension('btree_gist')
  
    pgm.createTable('appointments', {
      id: 'id',
  
      organization_id: {
        type: 'integer',
        notNull: true,
        references: 'organizations',
        onDelete: 'cascade',
      },
  
      barber_id: {
        type: 'integer',
        notNull: true,
        references: 'barbers',
        onDelete: 'cascade',
      },
  
      service_id: {
        type: 'integer',
        notNull: true,
        references: 'services',
        onDelete: 'restrict',
      },
  
      start_time: {
        type: 'timestamptz',
        notNull: true,
      },
  
      end_time: {
        type: 'timestamptz',
        notNull: true,
      },
  
      status: {
        type: 'text',
        notNull: true,
        default: 'BOOKED',
      },
  
      created_at: {
        type: 'timestamptz',
        default: pgm.func('now()'),
      },
    })
  
    // Ensure valid time range
    pgm.addConstraint('appointments', 'appointments_time_valid', {
      check: 'start_time < end_time',
    })
  
    // Prevent overlapping appointments per barber
    pgm.sql(`
      ALTER TABLE appointments
      ADD CONSTRAINT appointments_no_overlap
      EXCLUDE USING gist (
        barber_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
      )
    `)
  }
  
  exports.down = (pgm) => {
    pgm.dropTable('appointments')
  }
