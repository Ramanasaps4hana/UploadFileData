using { FileUploader.db as db } from '../db/data-models';

service CatalogService {
    entity Computers as projection on db.Computers;

    function uploadExcel() returns String;
}