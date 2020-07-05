CREATE TABLE "todo_list"(
	"id" serial primary key,
	"task" varchar(255) NOT NULL,
	"completed" boolean
);

INSERT INTO todo_list (task, completed)
VALUES ('Get groceries', FALSE),
('Do homework', FALSE),
('Feed pets', TRUE),
('Work out', FALSE),
('Call bank', TRUE);