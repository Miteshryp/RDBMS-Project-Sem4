export default {
   user: String(process.env.PGUSER),
   host: String(process.env.PGHOST),
   port : Number(process.env.PGPORT),
   database: String(process.env.PGDB),
   password: String(process.env.PGPASSWORD)
};