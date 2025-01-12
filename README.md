# Cooperative Website

This is a cooperative website application built with Node.js, Express, and MongoDB. It provides user registration, login, and administrative functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Persist User Login](#persist-user-login)
  - [Logout User](#logout-user)
  - [Admin Registration](#admin-registration)
  - [Create User](#create-user)
  - [Persist Admin Login](#persist-admin-login)
  - [Logout Admin](#logout-admin)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/petepresh007/hlc_cp.git.git
    cd cooperative-website
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the following environment variables:
    ```env
    MONGO_URI=mongodb://127.0.0.1:27017
    USER_SECRET=your_user_secret
    ADMIN_SECRET=your_admin_secret
    ```

4. Start the application:
    ```sh
    npm start
    ```

## Usage

The application provides a set of RESTful API endpoints for user and admin management.

## API Endpoints
- **URL:** `https://hlc-cp.onrender.com`

### User Registration

- **URL:** `/api/user/reg-ad`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "role": "string"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "User registered successfully"
    }
    ```

### User Login

- **URL:** `/api/user/login`
- **Method:** `POST`
- **Description:** Login a user.
- **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Response:**
    ```json
    {
      "userWithoutPassword": { ... },
      "token": "string"
    }
    ```

### Persist User Login

- **URL:** `/api/user/persist`
- **Method:** `GET`
- **Description:** Persist user login.
- **Response:**
    ```json
    {
      "user": { ... }
    }
    ```

### Logout User

- **URL:** `/api/user/logout`
- **Method:** `POST`
- **Description:** Logout a user.
- **Response:**
    ```json
    {
      "msg": "user logged out successfully..."
    }
    ```

### Admin Registration

- **URL:** `/api/user/reg-ad`
- **Method:** `POST`
- **Description:** Register a new admin.
- **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "role": "string",
      "file":"string" 
    }
    ```
- **Response:**
    ```json
    {
      "msg": "User registered successfully"
    }
    ```

### Create User

- **URL:** `/api/user/create`
- **Method:** `POST`
- **Description:** Create a new user by admin.
- **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "file":"string"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "user created successfully....."
    }
    ```

### Persist Admin Login

- **URL:** `/api/user/persist-admin`
- **Method:** `GET`
- **Description:** Persist admin login.
- **Response:**
    ```json
    {
      "user": { ... }
    }
    ```

### Logout Admin

- **URL:** `/api/user/logout-admin`
- **Method:** `POST`
- **Description:** Logout an admin.
- **Response:**
    ```json
    {
      "msg": "user logged out successfully..."
    }
    ```

### edit user

- **URL:** `/api/user/edit/:userId`
- **Method:** `PUT`
- **Description:** edit user account.
- **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "file":"string"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "user account modified successfully..."
    }
    ```

## Error Handling

Errors are handled using a custom error handler middleware. The error responses are standardized with a status code and message.

## Environment Variables

- [MONGO_URI](http://_vscodecontentref_/1): MongoDB connection string.
- [USER_SECRET](http://_vscodecontentref_/2): Secret key for user JWT.
- [ADMIN_SECRET](http://_vscodecontentref_/3): Secret key for admin JWT.

## License

This project is licensed under the MIT License.