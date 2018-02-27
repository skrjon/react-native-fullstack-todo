DROP DATABASE IF EXISTS todo;
CREATE USER todoadmin WITH PASSWORD 'todo';
CREATE DATABASE todo OWNER todoadmin;

\connect todo;

CREATE TABLE users (
	id UUID PRIMARY KEY,
	google_id DECIMAL,
	name text DEFAULT '',
	img text DEFAULT ''
);
ALTER TABLE users OWNER TO todoadmin;
CREATE UNIQUE INDEX users_google_idx ON users (google_id);

INSERT INTO users (id,name) VALUES ('e23fb259-b997-48bf-a7ed-113f93a9d0df','Han Solo');
INSERT INTO users (id,name) VALUES ('b6c4e54e-2873-4e85-82cd-69487fadde46','Luke Skywalker');
INSERT INTO users (id,name) VALUES ('a06f5a32-cc32-4482-b214-b70c8de727bb','Leia Skywalker');
INSERT INTO users (id,name) VALUES ('8c2a2d59-0cf2-444b-9849-02058ddda80b','Chewbacca');
INSERT INTO users (id,name) VALUES ('0c9bf8d6-5de1-4583-a3ef-ff04cf0738e0','C-3PO');
INSERT INTO users (id,name) VALUES ('db7f1288-1b2e-44e8-ab91-26b0efe774a3','Lando Calrissian');

CREATE TABLE tasks (
	id UUID PRIMARY KEY,
	user_id UUID REFERENCES users (id),
	description TEXT DEFAULT '',
	completed BOOLEAN NOT NULL DEFAULT false
);
ALTER TABLE tasks OWNER TO todoadmin;
CREATE INDEX tasks_user_idx ON tasks (user_id);
CREATE INDEX tasks_completedx ON tasks (completed);

INSERT INTO tasks (id,description) VALUES ('c4e3928a-2b70-44b7-8914-90f6b0ac9a92','Work Work Work');
INSERT INTO tasks (id,user_id,description) VALUES ('f6dccf68-50ff-446a-a9ba-a2af0a2b9a6d','e23fb259-b997-48bf-a7ed-113f93a9d0df','Fix Hyperdrive');
INSERT INTO tasks (id,user_id,description) VALUES ('4f92c08a-b6f7-4477-87cd-872e0a223168','b6c4e54e-2873-4e85-82cd-69487fadde46','Clean droids');
INSERT INTO tasks (id,description) VALUES ('e9273ad6-f0bc-4c78-b408-d89913bdea21','Reassemble C-3PO');

CREATE TABLE tokens (
	id UUID PRIMARY KEY,
	user_id UUID REFERENCES users (id),
	created INTEGER NOT NULL,  /* Valid data size until 2038 */
	expires INTEGER NOT NULL  /* Valid data size until 2038 */
);
ALTER TABLE tokens OWNER TO todoadmin;