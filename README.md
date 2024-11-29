# FITS-AI API User Guide

Welcome to the FITS-AI API user guide. This document explains how to set up and use the FITS-AI API, assuming you have access to the provided `.env` example configuration file.

---

## Prerequisites

Before starting, ensure the following tools are installed on your system:

- **Node.js** (v14 or later)
- **npm** or **yarn** for package management
- A **MySQL database** server running and accessible
- **Postman** or another API testing tool (optional but recommended)

---

## Setting Up the Environment

1. **Clone the FITS-AI Repository**  
   Clone the FITS-AI API source code from your repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**  
   Install the required Node.js dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create and Configure the `.env` File**  
   The `.env` file is used to configure environment variables. Use the `.env.example` as a template:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and configure the variables:

   ```env
   DATABASE_URL="mysql://user@host:port/db_name"
   JWT_SECRET="your_jwt_secret"
   REFRESH_TOKEN_SECRET="your_refresh_token_secret"
   ```

   - Replace `user` with your MySQL username.
   - Replace `host` with your database host (e.g., `localhost`).
   - Replace `port` with your database port (default is `3306`).
   - Replace `db_name` with the name of your MySQL database.
   - Replace `your_jwt_secret` and `your_refresh_token_secret` with secure random strings for token generation.

4. **Migrate the Database**  
   Ensure the database is set up correctly by running migrations:
   ```bash
   npm run migrate
   # or
   yarn migrate
   ```

---

## Starting the API Server

1. Start the development server:
   ```bash
   npm run start-dev
   # or
   yarn start-dev
   ```

2. The API should now be running on `http://localhost:3000` (default).

3. To start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

---

## Using the FITS-AI API

### Authentication

1. **Generate an Access Token**  
   Use the `/auth/login` endpoint to authenticate a user and generate an access token. Example payload:
   ```json
   {
     "email": "example_email",
     "password": "example_password"
   }
   ```
   The response will include an access token and a refresh token.

2. **Use the Access Token**  
   Include the access token in the `Authorization` header of your API requests:
   ```http
   Authorization: Bearer <access_token>
   ```

3. **Refresh the Token**  
   Use the `/auth/refresh` endpoint to refresh the access token when it expires. Include the refresh token in the payload.

### Example Endpoints

#### 1. **Get User Product**
   **Endpoint:** `/api/v1/products`  
   **Method:** `GET`  
   **Headers:**
   ```http
   Authorization: Bearer <access_token>
   ```
   **Response:**
   ```json
   {
    "success": true,
    "message": "Products retrieved successfully.",
    "userProducts": [
        {
            "id": "GZsGCpYuZHXntJo7o6THZ",
            "product_id": "3D4bx3VNNKVy1t6Y3s_dw",
            "created_at": "2024-11-18T11:06:01.000Z",
            "users_id": "B0yx3KGXStC1j683cSr_b",
            "product": {
                "id": "3D4bx3VNNKVy1t6Y3s_dw",
                "name": "Coca-cola",
                "grade": {
                    "id": 1,
                    "grade_name": "A",
                    "grade_desc": "Product ini bagus"
                },
                "calories": "200 kcal",
                "calories_ing": "sugar, flour",
                "protein": "10 g",
                "protein_ing": "soy, milk",
                "fat": "5 g",
                "fat_ing": "butter, cream",
                "fiber": "2 g",
                "fiber_ing": "oats, flaxseed",
                "carbo": "30 g",
                "carbo_ing": "wheat, rice",
                "sugar": "15 g",
                "sugar_ing": "sucrose, honey"
            }
        }
     ]
  }
   ```

#### 2. **Add User Allergy**
   **Endpoint:** `/api/v1/users/allergy`  
   **Method:** `POST`  
   **Headers:**
   ```http
   Authorization: Bearer <access_token>
   ```
   **Payload:**
   ```json
   {
     "data": [
       {
         "allergy_name": "Lactose Intolerance"
       }
     ]
   }
   ```
   **Response:**
   ```json
   {
     "message": "Preferences updated successfully"
   }
   ```

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**  
   Ensure the `DATABASE_URL` in the `.env` file is correctly configured and the MySQL server is running.

2. **JWT Token Errors**  
   - Ensure `JWT_SECRET` and `REFRESH_TOKEN_SECRET` are set correctly in the `.env` file.
   - Verify the tokens are included in the API request headers.

3. **Server Not Starting**  
   Check for missing dependencies or configuration issues in the `.env` file. Run:
   ```bash
   npm run check-env
   ```

---

## Additional Resources

- [FITS-AI Documentation](<documentation-url>)
- [Postman Collection](<postman-collection-url>)

If you encounter issues not covered here, please contact support at [bimagung2203@gmail.com](mailto:bimagung2203@gmail.com).

