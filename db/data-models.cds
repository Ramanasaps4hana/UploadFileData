namespace FileUploader.db;

entity Computers {
    key ID    : Integer;
        name  : String(200);
        model : String(200);
        price : Decimal(23, 3);
        stock : Integer
}