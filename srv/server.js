const cds = require("@sap/cds");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs-extra");

cds.on("bootstrap", app => {

    // once excel uploaded, we need to store it locally to process the file data
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "srv/")
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    });

    // create multer instance with local storage
    const upload = multer({storage: storage});

    // get Excel data and store into temporary file within CAPM Project under srv/uploads folder
    const getExcelData = async (req, res, next) => {
        try {
            // get file path from excel uploaded
            let path = req.file.path;
            // read workbook from file path
            var workbook = XLSX.readFile(path);
            // get sheetname from excel
            var sheetNameList = workbook.SheetNames;
            // get data from sheet
            var jsonData = XLSX.utils.sheet_to_json(
                workbook.Sheets[sheetNameList[0]]
            );
            if(jsonData.length === 0){
                return req.err({code: 501, message: "excel sheet has no data"});
            };

            req.data = {};
            req.data.excelData = jsonData;
            await fs.remove(path);
            next();

        } catch (error) {
            res.send({code: 500, message: error.message});
        }
    };

    // Based on user request for excel upload , the route /catalog/uploadExcel will be triggered
    // the route uploadExcel is also the function defined in service.cds file
    // route called from browser|function to be called|Next function to be called
    app.get('/catalog/uploadExcel*', upload.single("xlsx"), getExcelData);
});

module.exports = cds.server;