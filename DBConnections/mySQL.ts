import mysql from "mysql2"

const sqlPassword = process.env.SQLPASSWORD;

const connectionMySql = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: sqlPassword,
    database: ""            //add the name of the database in the project 
})

connectionMySql.connect((err) => {
    try {
        if (err) throw err;
        console.log("mySQL server is connected!!")
    } catch (error) {
        console.error(error)
    }
})

export default connectionMySql