# Backend Repo

## Data Models and Relationships

The database that will be used for this backend is MongoDB hosted in MongoDB Atlas.

There are 3 models I will create for this exercise: User, Course, Question

## User

Has a one to many relationship with courses and questions, however the relationships differ.

### Relationship with Courses

Since the number of courses a user has is relatively small, we will store the course references in the user.

### Relationship with Questions

A user can have a large amount of questions, a question can have one user, therefore the reference will not be stored in the user.

## Course

I will create one course. Courses have a one to many relationship with Users and Questions.

### Relationship with Users

A course can have a large amount of users, therefore it is not optimal to store the reference to the user in the course document.

### Relationship with Questions

A course can have a very large amount of questions, therefore it is not optimal to store the references in the course document.

## Question

A question has a one to one relationship with Users and Questions, therefore the reference to the user and course will be stored in the question document.

### Data from users and course in the document

Since we will be using the user username and avatar as well as the course name regularly in our question data, these fields will be included in the document to make the queries more efficient.

## Seeding the DB

Go to the **seed.js** file to change the parameters for the seeding process. The amount of documents being creatde can be managed with the userQuantity and questionQuantity. To execute, uncomment **seedDb** from the import and database connection.

- Re-seeding db: Uncomment first lines in seedDb to wipe the DB and create new seed data.

Once a seed has been created, running seedDb again will not create more seeds becuase it verifies the existance of data.
