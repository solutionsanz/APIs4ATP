DROP TABLE orders_admin.Orders;
DROP USER orders_admin;
DROP SEQUENCE orders_seq;

CREATE USER orders_admin IDENTIFIED BY Welcome12345#;
GRANT CREATE SESSION, SELECT ANY TABLE, INSERT ANY TABLE, DELETE ANY TABLE, UPDATE ANY TABLE TO orders_admin;

CREATE TABLE orders_admin.Orders (
    OrderId NUMBER(10) NOT NULL,
    Product VARCHAR2(50) NOT NULL,
    Organization VARCHAR2(50) NOT NULL,
    Shipment VARCHAR2(50) NOT NULL,
    Quantity NUMBER NOT NULL,
    UnitPrice NUMBER NOT NULL,
    Contact VARCHAR2(50) NOT NULL
);

ALTER TABLE orders_admin.Orders ADD (
  CONSTRAINT orders_pk PRIMARY KEY (OrderId));

CREATE SEQUENCE orders_seq START WITH 1;

CREATE OR REPLACE TRIGGER orders_bir 
BEFORE INSERT ON orders_admin.Orders 
FOR EACH ROW

BEGIN
  SELECT orders_seq.NEXTVAL
  INTO   :new.OrderId
  FROM   dual;
END;
/

INSERT INTO orders_admin.Orders (Product, Organization, Shipment, Quantity, UnitPrice, Contact) 
    VALUES ('Holy Socks', 'Bmart', '20 John Martin Sox', 35, 99.9, 'Carlos');
    
INSERT INTO orders_admin.Orders (Product, Organization, Shipment, Quantity, UnitPrice, Contact) 
    VALUES ('Colourful', 'Cmart', '35 Alex Blyth St', 20, 9.50, 'Dave');
    
SELECT * FROM orders_admin.Orders;

commit;
