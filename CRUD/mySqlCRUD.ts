import { Results } from "../DBConnections/interfaces";
import connectionMySql from "../DBConnections/mySQL";

//create
export const saveData = async (req: any, res: any, schemaName, data: any) => {
    const query = `INSERT INTO ${schemaName} ${data} VALUES ('${data}');`;
    connectionMySql.query(query, (err, resultsAdd: Results) => {
      try {
        if (err) throw err;
        if (resultsAdd.affectedRows) {
          const query2 = `SELECT * FROM ${schemaName} WHERE ${schemaName}_id = ${resultsAdd.insertId}`;
          connectionMySql.query(query2, (err2, results) => {
            if (err2) throw err2;
            const result2Id = results[0].schemaName_id;
            res.send({ ok: true, result2Id });
          });
        }
      } catch (error) {
        res.status(500).send({ ok: false, error: "at saveData 2nd try-catch" });
      }
    });
}