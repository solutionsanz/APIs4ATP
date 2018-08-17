DROP TABLE Orders;
DROP USER orders_admin;
CREATE USER orders_admin IDENTIFIED BY Welcome12345#;
GRANT SELECT ANY TABLE, INSERT ANY TABLE, DELETE ANY TABLE, UPDATE ANY TABLE TO orders_admin;

CREATE TABLE Orders (
    OrderId NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    Product VARCHAR2(50),
    Organization VARCHAR2(50),
    Shipment VARCHAR2(50),
    Quantity NUMBER,
    UnitPrice NUMBER,
    Contact VARCHAR2(50)
);

INSERT INTO Orders (Product, Organization, Shipment, Quantity, UnitPrice, Contact) 
    VALUES ('Holy Socks', 'Bmart', '20 John Martin Sox', 35, 99.99, 'Carlos');
    
SELECT * FROM Orders;

commit;
