const cds = require("@sap/cds");

module.exports = cds.service.impl(async function() {
    this.on('uploadExcel', async (req, res) => {
        try {
            let data = req.req.data.excelData;
            let tableName = 'FILEUPLOADER_DB_COMPUTERS';
            let result = await insertData(req, data, tableName);
            return result;
        } catch (error) {
            return req.error({code: 500, messsage: error.message})
        }
    });

    async function insertData(req, data, tableName) {
        try {
            let query = INSERT.into(tableName, data);
            let result = await cds.tx(req).run(query).catch( (error) => {
                return req.error({code: 500, message: error.message})
            });
            
            if(result.results) {
                return "Data Inserted into Table";
            }else {
                return "error during data insertion into table";
            }
        } catch (error) {
            return error.message;
        }
    }
});