# Spoon & Sip - REST API 

This is a RESTful API built using Node.js, Express, and MongoDB. This document provides a detailed explanation of all API endpoints for the Spoon & Sip backend system, written in English. It includes request methods, routes, authentication requirements, expected request bodies, and detailed descriptions of what each endpoint does. It manages for example user authentication, menu items, customer orders, user reviews, and contact messages for the Spoon & Sip café application.

---

## Project Repository
The frontend repository is available at: [Frontend-Git-repo](https://github.com/SaraM47/frontend-spoon-sip.git).< br / >
The frontend application that uses this API is available at: [Frontend link](https://spoon-and-sip.netlify.app/)

---

## Database Structure

The API uses a NoSQL MongoDB database. The following collections are defined and actively used: `Users`, `MenuItems`, `Orders`, `Reviews`, and `ContactMessages`.

---

## Users

User accounts are registered via email and password and assigned roles such as customer or admin.

```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "role": "'customer' | 'admin'",
  "account_created": "Date"
}
```
Passwords are securely hashed using bcrypt before storage. New users are assigned the role "customer" by default. Admins have access to protected routes and moderation features.

MenuItems
Each menu item represents a product such as a smoothie, acai bowl, or juice.

```json
{
  "_id": "ObjectId",
  "name": "string",
  "price": "number",
  "ingredients": ["string"],
  "category": "string",
  "image": "string (Cloudinary URL)"
}
```
The image field contains a URL hosted by Cloudinary. Menu items can be filtered by category and are shown on the public menu page.

Orders
Orders are placed by customers through the take-away form and stored in this collection.

```json
{
  "_id": "ObjectId",
  "customerName": "string",
  "phone": "string",
  "time": "Date",
  "menuItemIds": ["ObjectId (ref: MenuItem)"],
  "people": "number (optional)",
  "note": "string (optional)",
  "status": "'pending' | 'completed'",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Each order references multiple menu items. A receipt is automatically generated after submission. Orders can be marked as completed or deleted by admins.

Reviews
Users can leave reviews on individual menu items. Each review is linked to both a menu item and a user.

```json
{
  "_id": "ObjectId",
  "menuItemId": "ObjectId (ref: MenuItem)",
  "userId": "ObjectId (ref: User)",
  "name": "string",
  "rating": "number (1–5)",
  "comment": "string",
  "createdAt": "Date"
}
```
Users can post, edit, and delete their own reviews. Admins have the ability to moderate all submitted reviews. The system prevents duplicate reviews from the same user for the same item.

ContactMessages
Messages submitted via the contact form are stored here. If a user is authenticated, their userId may also be attached.

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (optional, populated if user is logged in)",
  "name": "string",
  "email": "string",
  "message": "string",
  "createdAt": "Date"
}
```
Admins can view and delete these messages in the admin panel. Unauthenticated/public users can also submit messages via the public contact form.

---

## API Endpoints

- Uses **JWT (JSON Web Tokens)**.
- Tokens are passed via `Authorization: Bearer <token>` in protected routes.


### Authentication Routes

| Method | Endpoint             | Body                       | Requires Auth | Description                        |
|--------|----------------------|----------------------------|----------------|------------------------------------|
| POST   | /api/auth/register   | email, password            | No             | Registers a new user account.      |
| POST   | /api/auth/login      | email, password            | No             | Logs in a user and returns a token.|

### User Access

| Method | Endpoint        | Requires Auth | Description                     |
| ------ | --------------- | ------------- | ------------------------------- |
| GET    | /api/users      | Yes (admin)   | Retrieves all registered users. |
| DELETE | /api/users/\:id | Yes (admin)   | Deletes a specific user.        |


### Menu Item Routes

| Method | Endpoint            | Body                                   | Requires Auth | Description                                        |
|--------|---------------------|----------------------------------------|----------------|----------------------------------------------------|
| GET    | /api/menu           | -                                      | No             | Returns all menu items.                           |
| GET    | /api/menu/:id       | -                                      | No             | Returns one specific menu item by ID.             |
| POST   | /api/menu           | name, price, ingredients, category, image | Yes (admin)  | Adds a new menu item with image upload support.   |
| PUT    | /api/menu/:id       | same as above                          | Yes (admin)    | Updates a menu item.                              |
| DELETE | /api/menu/:id       | -                                      | Yes (admin)    | Deletes a menu item.                              |

### Order Routes

| Method | Endpoint              | Body                              | Requires Auth | Description                                           |
|--------|-----------------------|-----------------------------------|----------------|-------------------------------------------------------|
| POST   | /api/orders           | customerName, phone, time, menuItemIds | No         | Creates a new order and returns a receipt.           |
| GET    | /api/orders           | -                                 | Yes           | Retrieves all orders (admin only).                   |
| GET    | /api/orders/completed| -                                 | Yes           | Retrieves all completed orders.                      |
| GET    | /api/orders/pending  | -                                 | Yes           | Retrieves all pending orders.                        |
| PATCH  | /api/orders/:id      | status                            | Yes           | Updates the status of a specific order.              |
| DELETE | /api/orders/:id      | -                                 | Yes           | Deletes an order by ID.                              |
| GET    | /api/orders/stats    | -                                 | Yes           | Returns order statistics (pending, completed, total).|

### Review Routes

| Method | Endpoint                    | Body                        | Requires Auth | Description                                             |
|--------|-----------------------------|-----------------------------|----------------|---------------------------------------------------------|
| POST   | /api/reviews                | menuItemId, name, rating, comment | Yes       | Creates a new review.                                  |
| GET    | /api/reviews/:menuItemId   | -                           | No             | Retrieves all reviews for a given menu item.           |
| GET    | /api/reviews/check/:productId | -                        | Yes            | Checks if the user has already submitted a review.     |
| PUT    | /api/reviews/review/:id    | rating, comment             | Yes            | Updates an existing review (only by the review's author). |
| DELETE | /api/reviews/review/:id    | -                           | Yes (admin or owner) | Deletes a review.                                 |

### Contact Message Routes

| Method | Endpoint             | Body                   | Requires Auth | Description                              |
|--------|----------------------|------------------------|----------------|------------------------------------------|
| POST   | /api/contact         | name, email, message   | No             | Submits a new contact message.           |
| GET    | /api/contact         | -                      | Yes (admin)    | Retrieves all contact messages.          |
| DELETE | /api/contact/:id     | -                      | Yes (admin)    | Deletes a contact message by ID.         |

---

## Image Upload

Images for menu items are uploaded using multipart/form-data through Multer. The images are stored in Cloudinary. The field name for the image is `image`.

## Roles and Access Control

The API distinguishes between two user roles: `customer` and `admin`. Customers can register, log in, place orders, and submit reviews. Admins have additional privileges such as managing menu items, viewing orders and statistics, and moderating reviews and contact messages.

## Technology Stack

This project is built using Node.js and Express on the backend. MongoDB is used for data storage, and Mongoose handles data modeling. Authentication is handled using JWT. Image upload is handled via `multipart/form-data` and stored in Cloudinary.

## Testing

You can test this API using tools like Postman or Thunder Client. When calling protected routes, be sure to include a valid JWT token in the `Authorization` header in the format `Bearer <your-token>`.

