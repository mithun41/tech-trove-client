# 🚀 Tech Trove

Tech Trove is a full-stack web application built with React, Tailwind CSS, Firebase, MongoDB, and Stripe. The platform allows users to discover and upvote trending tech products, subscribe to premium services, and manage user-generated content. It supports role-based dashboards for **User**, **Moderator**, and **Admin**.

Live Site: [🔗 project-tech-trove.surge.sh](http://project-tech-trove.surge.sh)

---

## 🛠️ Tech Stack

| Frontend                     | Backend / Server     | Database | Authentication | Payment |
| ---------------------------- | -------------------- | -------- | -------------- | ------- | --- | ------------ | --- | --- | --- | --- |
| React (Vite)                 | Express.js (Node.js) | MongoDB  | Firebase Auth  | Stripe  |
| Tailwind CSS + DaisyUI       | Firebase Admin SDK   |          | JWT (optional) |         |     | React Router |     |     |     |     |
| TanStack Query (React Query) |                      |          |                |
| Framer Motion (Animations)   |                      |          |                |

---

## 🔑 Features

User Authentication: Secure signup and login functionality powered by Firebase Authentication.

Role-Based Access: Different views and permissions for regular users and admin users.

Product Browsing: Clean and responsive product listing with search and category filtering.

Product Upvoting: Users can upvote their favorite products, helping highlight trending items.

Real-Time Reviews: Customers can read and leave product reviews with star ratings.

Admin Dashboard: Manage users, products, coupons, and view product and user statistics with interactive charts.

Coupons Management: Admins can create and manage discount coupons.

Interactive Charts: Dashboard displays data visualization with charts for product votes, user activity, and reviews.

Smooth Animations: Framer Motion used for UI transitions and hover effects to enhance user experience.

Payment Integration: Secure checkout with Stripe for product purchases.

Responsive Design: Fully mobile-friendly interface designed with Tailwind CSS.

Notifications & Alerts: Toast notifications and SweetAlert modals for user feedback and confirmations.

Product Carousel: Slick slider for featured or trending products to attract user attention.

Form Validation: Robust form handling and validation using React Hook Form.

### 🧑 User

- Register/Login with email & password or Google
- Add Products with images, descriptions, and tags
- View personal products in "My Products"
- Subscribe via Stripe to access premium features
- Upvote and report products
- View featured and trending products
- Write reviews on product detail page

### 🛡 Moderator

- Access to product moderation queue
- Accept or reject pending products
- Manage reported products (based on report count)

### 👑 Admin

- Dashboard with statistics: Pie Chart + Cards
- Manage Users: Role update to `admin`, `moderator`, or `user`
- Add, edit, and delete coupons
- View subscription statistics

---

## 📊 Admin Dashboard

- Total Users
- Total Products
- Pending vs Accepted Products (Pie Chart)
- Total Reviews
- Subscribed Users Count
- Top Voted Product
- Recent Users List

---

## 💳 Subscription (Stripe)

- Users can subscribe for $50 using Stripe
- Subscription updates user's `isSubscribed` status
- Payment intent generated from backend

---

## 🎁 Coupon System

- Admin can create, edit, and delete coupons
- Coupons contain: code, discount, expiry date, description
- Coupons displayed in card grid layout with modal edit functionality

---
