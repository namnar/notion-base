ALTER TABLE attributes RENAME TO attributes_old;


CREATE TABLE attributes (
    id varchar(50) NOT NULL PRIMARY KEY,
    notion_id varchar(50) NOT NULL,
    entity_type varchar(50),
    data_type varchar(50),
    source_db varchar(100),
    FOREIGN KEY (source_db) REFERENCES db_metadata(db_id)
);


INSERT INTO attributes (id,  notion_id, entity_type, data_type, source_db) 
SELECT id, notion_id, entity_type, data_type, source_db FROM attributes_old;


DROP TABLE attributes_old;