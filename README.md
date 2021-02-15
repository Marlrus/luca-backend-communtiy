# Backend Repo

To make the repo run locally, I will not store env variables in an env file. There will be a deprecation warning due to the latest version of MongoDB, however this message is a bug and the mongo team are working on removing it.

## Installing and running

### Requirements

- Node (14.x recommended)
- Yarn (recommended)

Without yarn, replace commands with npm install, npm run start.

### Installation

`yarn install`

### Running the server

`yarn start`

## Data Models and Relationships

The database that will be used for this backend is MongoDB hosted in MongoDB Atlas.

There are 3 models I will create for this exercise: User, Course, Question

## User

```javascript
const UserSchema = new mongoose.Schema({
  name: String,
  last_name: String,
  username: String,
  email: String,
  avatar: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  enrollment_date: { type: Date, default: Date.now },
});
```

Has a one to many relationship with courses and questions, however the relationships differ.

### Relationship with Courses

Since the number of courses a user has is relatively small, we will store the course references in the user.

### Relationship with Questions

A user can have a large amount of questions, a question can have one user, therefore the reference will not be stored in the user.

## Course

```javascript
const CourseSchema = new mongoose.Schema({
  name: String,
  teachers: [mongoose.Schema.Types.ObjectId],
  creation_date: { type: Date, default: Date.now },
});
```

I will create one course. Courses have a one to many relationship with Users and Questions.

### Relationship with Users

A course can have a large amount of users, therefore it is not optimal to store the reference to the user in the course document.

### Relationship with Questions

A course can have a very large amount of questions, therefore it is not optimal to store the references in the course document.

## Question

```javascript
const QuestionSchema = new mongoose.Schema({
  username: String,
  user_avatar: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course_name: String,
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  question: String,
  details: String,
  creation_date: { type: Date, default: Date.now },
});
```

A question has a one to one relationship with Users and Questions, therefore the reference to the user and course will be stored in the question document.

### Data from users and course in the document

Since we will be using the user username and avatar as well as the course name regularly in our question data, these fields will be included in the document to make the queries more efficient.

## Seeding the DB

Go to the **seed.js** file to change the parameters for the seeding process. The amount of documents being creatde can be managed with the userQuantity and questionQuantity. To execute, uncomment **seedDb** from the import and database connection.

- Re-seeding db: Uncomment first lines in seedDb to wipe the DB and create new seed data.

Once a seed has been created, running seedDb again will not create more seeds becuase it verifies the existance of data.

## Question Routes

### list: GET: /question

Paginated using cursor pagination, returns questions from newest to oldest.

#### Payload

```json
{
  "page": <int | optional | default: 1>,
  "limit": <int | optional | default: 15>,
}
```

#### Response (based on mock response)

```json
{
  "success": true,
  "totalDocs": 304,
  "limit": 15,
  "totalPages": 21,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2,
  "data": {
    "docs": [
    {
      "_id": "602812e745d619326846ffdc",
      "username": "Laura.Welch41",
      "user_avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/joe_black/128.jpg",
      "user_id": "6027fb93e3a522eb6f7061e8",
      "course_name": "Matemáticas 6º",
      "course_id": "6027fb93e3a522eb6f7061e7",
      "question": "¿Cuáles son los múltiplos del 7?",
      "details": "La verdad no me queda muy claro cuáles son los múltiplos del 7 porque es la tabla de multiplicacion mas complicada.",
      "creation_date": "2021-02-13T17:56:55.409Z",
      "__v": 0
    },
    ...
    ]
  }
}
```

### show: GET: /question/:\_id

Show details for one question

#### Payload

None, handled by param string.

#### Response (based on mock response)

```json
{
  "success": true,
  "data": {
    "_id": "60282081689d2747d94e773b",
    "username": "Laura.Welch41",
    "user_avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/joe_black/128.jpg",
    "user_id": "6027fb93e3a522eb6f7061e8",
    "course_name": "Matemáticas 6º",
    "course_id": "6027fb93e3a522eb6f7061e7",
    "question": "¿3Cuáles son los múltiplos del 7?",
    "details": "3La verdad no me queda muy claro cuáles son los múltiplos del 7 porque es la tabla de multiplicacion mas complicada.",
    "creation_date": "2021-02-13T18:54:57.204Z",
    "__v": 0
  }
}
```

### create: POST: /question

Create a question based on user id and course_id. In the design there is no course selector for the question, therefore I will default to the only course I created in the database. The request responds with the new created question in order to use it in the front end.

#### Body

```json
{
  "user_id": <string | required>,
  "question":<string | required>,
  "details": <string | required>
  "course_id": <string | optional | default: user course at 0>,
}
```

#### Response (based on mock response)

```json
{
  "success": true,
  "data": {
    "_id": "60282081689d2747d94e773b",
    "username": "Laura.Welch41",
    "user_avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/joe_black/128.jpg",
    "user_id": "6027fb93e3a522eb6f7061e8",
    "course_name": "Matemáticas 6º",
    "course_id": "6027fb93e3a522eb6f7061e7",
    "question": "¿Cuáles son los múltiplos del 7?",
    "details": "La verdad no me queda muy claro cuáles son los múltiplos del 7 porque es la tabla de multiplicacion mas complicada.",
    "creation_date": "2021-02-13T18:54:57.204Z",
    "__v": 0
  }
}
```

### update: PUT: /question/:\_id

Validates ownership based on data from the frontend. Requires the user_id and question_id to find and update the question.

#### Body

Question id is taken from param string.

```json
{
  "user_id": <string | required>,
  "question":<string | required>,
  "details": <string | required>
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "_id": "60282081689d2747d94e773b",
    "username": "Laura.Welch41",
    "user_avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/joe_black/128.jpg",
    "user_id": "6027fb93e3a522eb6f7061e8",
    "course_name": "Matemáticas 6º",
    "course_id": "6027fb93e3a522eb6f7061e7",
    "question": "¿3Cuáles son los múltiplos del 7?",
    "details": "3La verdad no me queda muy claro cuáles son los múltiplos del 7 porque es la tabla de multiplicacion mas complicada.",
    "creation_date": "2021-02-13T18:54:57.204Z",
    "__v": 0
  }
}
```

### delete: DELETE: /question/:\_id

Validates ownership based on data from frontend and deletes a question.

#### Body

Question id is taken from param string.

```json
{
  "user_id": <string | required>,
}
```

#### Response

```json
{
  "success": true,
  "message": "Comment deleted successfully."
}
```

## User Routes

### get: GET /user

Gets one user from DB to be used as the user while navigating the page. This will mock a login/auth step.

#### Response (Based on mock response)

```json
{
  "success": true,
  "data": {
    "courses": ["6027fb93e3a522eb6f7061e7"],
    "_id": "6027fb93e3a522eb6f7061e8",
    "name": "Luz",
    "last_name": "Prohaska",
    "username": "Laura.Welch41",
    "email": "Alexanne7@gmail.com",
    "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/joe_black/128.jpg",
    "enrollment_date": "2021-02-13T16:17:23.331Z",
    "__v": 0
  }
}
```
