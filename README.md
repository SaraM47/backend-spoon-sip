# Spoon & Sip - REST API 

This is a RESTful API built using Node.js, Express, and MongoDB. This document provides a detailed explanation of all API endpoints for the Spoon & Sip backend system, written in English. It includes request methods, routes, authentication requirements, expected request bodies, and detailed descriptions of what each endpoint does. It manages for example user authentication, menu items, customer orders, user reviews, and contact messages for the Spoon & Sip café application.

---

## Project Repository
The frontend Fit repository: [Frontend-Git-repo](https://github.com/SaraM47/frontend-spoon-sip.git)
The frontend application that uses this API is available at: [Frontend link](https://spoon-and-sip.netlify.app/)

---

## Database Structure

The API uses a NoSQL MongoDB database. The following collections are defined and actively used: Users, MenuItems, Orders, Reviews, and ContactMessages.

---

## Authentication Endpoints

### `POST /api/auth/register`
- **Protected:** No
- **Body:** `{ email: string, password: string }`
- **Description:** Registers a new user. The password is hashed before storage. The default role assigned is `customer`.

### `POST /api/auth/login`
- **Protected:** No
- **Body:** `{ email: string, password: string }`
- **Description:** Logs in a user and returns a JWT token that must be used in subsequent authenticated requests.

---

## User Management (Admin Only)

### `GET /api/users`
- **Protected:** Yes (Admin only)
- **Description:** Retrieves a list of all registered users. Passwords are excluded in the returned data.

### `DELETE /api/users/:id`
- **Protected:** Yes (Admin only)
- **Description:** Deletes a specific user by their ID. Admins cannot delete their own account.

Passwords are securely hashed using bcrypt before storage. All new users are assigned the role of `customer` by default unless explicitly set to `admin`.

---

## Menu Management

### `GET /api/menu`
- **Protected:** No
- **Description:** Returns a list of all menu items including name, price, ingredients, category, and image.

### `GET /api/menu/:id`
- **Protected:** No
- **Description:** Returns the details of a single menu item by its ID.

### `POST /api/menu`
- **Protected:** Yes (Admin only)
- **Body:** `multipart/form-data` containing `{ name, price, ingredients[], category, image }`
- **Description:** Adds a new menu item to the database, including uploading an image to Cloudinary.

### `PUT /api/menu/:id`
- **Protected:** Yes (Admin only)
- **Body:** Same as POST. If an image is included, it replaces the old one.
- **Description:** Updates the details of an existing menu item.

### `DELETE /api/menu/:id`
- **Protected:** Yes (Admin only)
- **Description:** Deletes a menu item by ID.

---

## 📦 Order Management

### `POST /api/orders`
- **Protected:** No
- **Body:** `{ customerName, phone, time, menuItemIds[], note?, people? }`
- **Description:** Submits a new takeaway order. A formatted receipt is returned.

### `GET /api/orders`
- **Protected:** Yes (Admin only)
- **Description:** Retrieves all customer orders.

### `GET /api/orders/pending`
- **Protected:** Yes (Admin only)
- **Description:** Fetches orders that are marked as "pending".

### `GET /api/orders/completed`
- **Protected:** Yes (Admin only)
- **Description:** Fetches orders that are marked as "completed".

### `PATCH /api/orders/:id`
- **Protected:** Yes (Admin only)
- **Body:** `{ status: "pending" | "completed" }`
- **Description:** Updates the status of a specific order.

### `DELETE /api/orders/:id`
- **Protected:** Yes (Admin only)
- **Description:** Deletes an order by its ID.

### `GET /api/orders/stats`
- **Protected:** Yes (Admin only)
- **Description:** Returns statistics such as total orders, number of pending and completed.

---

## Reviews

### `POST /api/reviews`
- **Protected:** Yes (Logged in users)
- **Body:** `{ menuItemId, name, rating, comment }`
- **Description:** Creates a review for a specific menu item.

### `GET /api/reviews/:menuItemId`
- **Protected:** No
- **Description:** Returns all reviews for the specified menu item.

### `GET /api/reviews/check/:productId`
- **Protected:** Yes
- **Description:** Checks whether the current user has already reviewed the given menu item.

### `PUT /api/reviews/review/:id`
- **Protected:** Yes
- **Body:** `{ rating, comment }`
- **Description:** Allows the user to update their own review.

### `DELETE /api/reviews/review/:id`
- **Protected:** Yes (Author or Admin)
- **Description:** Deletes the specified review. Users can delete their own, admins can delete all.

---

## Contact Messages

### `POST /api/contact`
- **Protected:** No
- **Body:** `{ name, email, message }`
- **Description:** Submits a contact message via the contact form on the frontend.

### `GET /api/contact`
- **Protected:** Yes (Admin only)
- **Description:** Retrieves all submitted contact messages.

### `DELETE /api/contact/:id`
- **Protected:** Yes (Admin only)
- **Description:** Deletes a specific contact message by ID.

---

## Image Upload

Images for menu items are uploaded using multipart/form-data through Multer. The images are stored in Cloudinary. The field name for the image is `image`.

## Roles and Access Control

The API distinguishes between two user roles: `customer` and `admin`. Customers can register, log in, place orders, and submit reviews. Admins have additional privileges such as managing menu items, viewing orders and statistics, and moderating reviews and contact messages.

## Technology Stack

This project is built using Node.js and Express on the backend. MongoDB is used for data storage, and Mongoose handles data modeling. Authentication is handled using JWT. Image upload is handled via `multipart/form-data` and stored in Cloudinary.

## Testing

You can test this API using tools like Postman or Thunder Client. When calling protected routes, be sure to include a valid JWT token in the `Authorization` header in the format `Bearer <your-token>`.


