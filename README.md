# todo-api

CRUD API built using Node, MongoDB and Express. As this project only contains the backend, all testing was done through API requests on Postman. User can register by entering email, name and password, then logging in by entering email and password (simple authentication logic done through BCrypt and jsonwebtoken libraries). Once authenticated, the user can enter and view all todo items, filter by category and/or 'completed' status, get by ID, update and delete. The user can only update and delete their own items.

# API Routes

## Users

### Registration

`POST /users/reg/`

Required data params: email (String), name (String), password (String)

Stores new user into the database.

### Login

`POST /users/auth/`

Finds matching email, then checks for correct password entry through BCrypt. If correct, creates access token through jsonwebtoken that validates the user when making API requests for todo items.

## Todolist

### Create Todo Item

`POST /todolist/`

Required data params: task (String), category (String)

Optional data params: description (String)

Stores new todo item into the database. If 'description' is left blank, it is filled with default value "n/a". 'ownerId' and 'completed' are to be left blank (ideally, the frontend would not allow these fields to be entered) and are assigned the value of the user's ID and `false` respectively. 

### Get All Todo Items (with Optional Filter)

`GET /todolist/`

Optional URL params: category (String), completed (Boolean)

Returns all todo items in the database. If one or both of the above params are specified, the API will filter results to match requested values. See example URL below:

`/todolist/?category=homework&completed=false`

### Get Todo Item by ID

`GET /todolist/:todoId`

Required URL params: todoId (String)

Returns todo item of specified ID.

### Update Todo Item by ID

`PUT /todolist/:todoId`

Required URL params: todoId (String)

Optional data params: task (String), category (String), description (String), completed (Boolean)

Updates todo item of specified ID. The API will only update the todo item with requested values, otherwise it will stay the same.

### Delete Todo Item by ID

`DELETE /todolist/:todoId`

Required URL params: todoId (String)

Deletes todo item of specified ID.

## How to Run

From the root directory:

1. Install dependencies

```sh
npm install
```

2. Build and run backend

```sh
nodemon server.js 
OR
node server.js
```

The server is hosted on 'http://localhost:3000/'.
