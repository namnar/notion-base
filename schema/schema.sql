CREATE TABLE db_metadata (
    db_id varchar(100) PRIMARY KEY,
    db_name varchar(100),
    last_synced datetime,
    last_error TEXT
);

CREATE TABLE entities (
    id varchar(50) NOT NULL PRIMARY KEY,
    name varchar(100),
    type varchar(50),
    source_db varchar(100) NOT NULL,
    source_url varchar(2083),
    status varchar(50) CHECK (status IN ('active', 'archived', 'deleted')) DEFAULT 'active',
    is_dirty boolean DEFAULT false,
    created_at datetime, 
    last_updated datetime,
    last_synced datetime,
    resolved boolean DEFAULT true,
    FOREIGN KEY (source_db) REFERENCES db_metadata(db_id)
);

CREATE TABLE attributes (
    id varchar(50) NOT NULL PRIMARY KEY,
    name varchar(100),
    notion_id varchar(50) NOT NULL,
    source_db varchar(100) NOT NULL,
    FOREIGN KEY (source_db) REFERENCES db_metadata(db_id)
);

CREATE TABLE entity_values (
    value_content varchar(250),
    entity_id varchar(50) NOT NULL,
    attribute_id varchar(50) NOT NULL,
    PRIMARY KEY (entity_id, attribute_id),
    FOREIGN KEY (entity_id) REFERENCES entities(id),
    FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);

CREATE INDEX idx_values_entity ON entity_values(entity_id);
CREATE INDEX idx_values_attribute ON entity_values(attribute_id);
CREATE INDEX idx_entities_last_synced ON entities (last_synced);