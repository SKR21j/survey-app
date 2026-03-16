# Survey App – Database Schema Diagram

## Entity-Relationship Overview

```
┌─────────────────────────────────┐
│             users               │
├─────────────────────────────────┤
│ id          UUID  PK            │
│ username    VARCHAR(50)  UNIQUE │
│ email       VARCHAR(100) UNIQUE │
│ password    VARCHAR(255)        │
│ role        VARCHAR(20)         │
│ created_at  TIMESTAMP           │
│ updated_at  TIMESTAMP           │
└──────────┬──────────────────────┘
           │ 1
           │
    ┌──────┴──────────────────────┐
    │          surveys            │
    ├─────────────────────────────┤
    │ id          UUID  PK        │
    │ title       VARCHAR(255)    │
    │ description TEXT            │
    │ creator_id  UUID  FK→users  │
    │ status      VARCHAR(20)     │
    │ created_at  TIMESTAMP       │
    │ updated_at  TIMESTAMP       │
    └──┬───────────┬──────────────┘
       │ 1         │ 1
       │           │
  ┌────┴──────┐   ┌┴──────────────────────┐
  │ questions │   │       responses        │
  ├───────────┤   ├────────────────────────┤
  │ id   UUID PK  │ id          UUID  PK   │
  │ survey_id FK  │ survey_id   UUID  FK   │
  │ question_ │   │ user_id     UUID  FK→u │
  │   text    │   │ submitted_at TIMESTAMP │
  │ question_ │   └──────────┬─────────────┘
  │   type    │              │ 1
  │ required  │              │
  │ question_ │         ┌────┴──────────────┐
  │   order   │         │      answers       │
  │ created_at│         ├────────────────────┤
  └──┬────────┘         │ id           UUID  │
     │ 1                │ response_id  FK    │
     │                  │ question_id  FK    │
  ┌──┴──────────────┐   │ answer_text  TEXT  │
  │ question_options│   │ rating_value INT   │
  ├─────────────────┤   │ created_at   TS    │
  │ id   UUID PK    │   └────────────────────┘
  │ question_id FK  │
  │ option_text     │   ┌─────────────────────┐
  │ option_order    │   │       ratings        │
  └─────────────────┘   ├─────────────────────┤
                        │ id         UUID  PK  │
                        │ survey_id  UUID  FK  │
                        │ user_id    UUID  FK  │
                        │ rating     INT       │
                        │ created_at TIMESTAMP │
                        └─────────────────────┘
```

## Table Relationships

| Table             | References          | Cardinality        |
|-------------------|---------------------|--------------------|
| surveys           | users (creator_id)  | Many-to-One        |
| questions         | surveys             | Many-to-One        |
| question_options  | questions           | Many-to-One        |
| responses         | surveys, users      | Many-to-One (each) |
| answers           | responses, questions| Many-to-One (each) |
| ratings           | surveys, users      | Many-to-One (each) |

## Indexes

| Index name                          | Table            | Column(s)   |
|-------------------------------------|------------------|-------------|
| idx_users_email                     | users            | email       |
| idx_users_username                  | users            | username    |
| idx_surveys_creator_id              | surveys          | creator_id  |
| idx_surveys_status                  | surveys          | status      |
| idx_questions_survey_id             | questions        | survey_id   |
| idx_question_options_question_id    | question_options | question_id |
| idx_responses_survey_id             | responses        | survey_id   |
| idx_responses_user_id               | responses        | user_id     |
| idx_answers_response_id             | answers          | response_id |
| idx_answers_question_id             | answers          | question_id |
| idx_ratings_survey_id               | ratings          | survey_id   |
| idx_ratings_user_id                 | ratings          | user_id     |
