# Introduction
This is my mock project to learn about backend programming, written with Nodejs

# Tech stacks
Nodejs, express <br>
PostgreSQL (ORM - Sequelize) <br>
Stripe <br>
AWS <br>

# Architecture

# Use cases


# API
## User Access
Handle basic User access login

| **Method** | **Action**               | **Endpoint**                           |
|:----------:| ------------------------ | -------------------------------------- |
| `POST`     | Sign Up                  | `/v1/api/shop/signup`                  |
| `POST`     | Log In                   | `/v1/api/shop/login`                   |
| `POST`     | Log Out                  | `/v1/api/shop/logout`                  |
| `POST`     | Handle Refresh Token     | `/v1/api/shop/handleRefreshToken`      |

## User
| **Method** | **Endpoint**       | **Description**                  | **Middleware**                 |
|:----------:| ------------------ | -------------------------------- | ------------------------------ |
| `GET`      | `/v1/api/user`                | Get all users                    | `authentication`               |
| `GET`      | `/v1/api/user/admin`           | Get all admin users              | `authentication, verifyTokenAndAdmin` |
| `GET`      | `/v1/api/user/:id`             | Get user by ID                   | `authentication`               |
| `PUT`      | `/v1/api/user/:id`             | Update user by ID                | `authentication`               |
| `DELETE`   | `/v1/api/user/:id`             | Delete user by ID                | `authentication`               |


## Products

| **Method** | **Endpoint**          | **Action**                         | **Authentication Required** |
|:----------:| --------------------- | ---------------------------------- |:---------------------------:|
| `GET`      | `/v1/api/products`                   | Get all products                   | No                          |
| `GET`      | `/v1/api/products/:id`                | Get single product by ID           | No                          |
| `POST`     | `/v1/api/products/`                   | Create new product                 | Yes (Admin)                 |
| `POST`     | `/v1/api/products/upload`             | Upload product photos              | Yes (Admin)                 |
| `POST`     | `/v1/api/products/savephoto`          | Save photos to database            | Yes (Admin)                 |
| `PUT`      | `/v1/api/products/:id`                | Update product by ID               | Yes (Admin)                 |
| `DELETE`   | `/v1/api/products/:id`                | Delete product by ID               | Yes (Admin)                 |

## Cart

| **Method** | **Endpoint** | **Action**               | **Authentication Required** |
|:----------:| ------------ | ------------------------ |:---------------------------:|
| `GET`      | `/v1/api/cart`          | Get cart items           | Yes                         |
| `POST`     | `/v1/api/cart`          | Add to cart              | Yes                         |
| `DELETE`   | `/v1/api/cart`          | Delete user's cart       | Yes                         |

## Order

| **Method** | **Endpoint**    | **Action**                    | **Authentication Required** |
|:----------:| --------------- | ----------------------------- |:---------------------------:|
| `GET`      | `/v1/api/order`             | Get user's orders             | Yes (User)                  |
| `PUT`      | `/v1/api/order/:orderId`     | Update order by ID            | Yes (User)                  |
| `DELETE`   | `/v1/api/order/:orderId`     | Delete order by ID            | Yes (User)                  |
| `GET`      | `/v1/api/order/all`          | Get all orders                | Yes (Admin)                 |

## Payment

| **Method** | **Endpoint** | **Action**                  | **Authentication Required** |
|:----------:| ------------ | --------------------------- |:---------------------------:|
| `POST`     | `/v1/api/checkout`          | Handle checkout process     | Yes                         |
| `POST`     | `/v1/api/checkout/payment`   | Process payment             | Yes                         |
| `POST`     | `/v1/api/webhook`          | Handle payment webhook      | Yes                         |

## Category

| **Method** | **Endpoint**        | **Action**                  | **Authentication Required** |
|:----------:| ------------------- | --------------------------- |:---------------------------:|
| `GET`      | `/v1/api/category`                 | Get all categories          | No                          |
| `GET`      | `/v1/api/category/:category`        | Get single category details | No                          |
| `POST`     | `/v1/api/category`                 | Add a new category          | Yes (Admin)                 |
| `DELETE`   | `/v1/api/category/:categoryId`      | Delete category             | Yes (Admin)                 |
| `PUT`      | `/v1/api/category/:categoryId`      | Edit category               | Yes (Admin)                 |

# Future consideration

