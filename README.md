# Airport Management System

Hey there! 👋 This is an **Airport Management System** I built while learning **NestJS** with **GraphQL**. The goal was to dive deep into some core concepts and have fun while coding. 🚀

## What I Learned

While working on this project, I explored and implemented:

- **GraphQL Subscriptions** for real-time updates.
- **Job Queues** using **BullMQ** for background tasks like sending emails.
- **Dataloaders** to optimize database queries.
- **Role-Based Authentication** to manage access control for different user roles.
- **Docker** for containerization and managing dependencies.
- **Postgres** as the database.
- **Redis** for caching, pub/sub, and managing email jobs with **BullMQ**.

Oh, and one important thing: this project assumes that an **airline** and an **airport** are the same organization. However, the system is designed to support managing **multiple airports**. Just a heads-up! 😉

## How to Run It

1. Clone the repository.
2. Make sure you have **Docker** installed.
3. Create a `.env` file in the root directory with the following environment variables:

   ```env
   PORT=3000
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DB=airport_db
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432
   ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=604800
   JWT_SECRET=your_secret_key
   SENDGRID_API_KEY="api key"
   SENDGRID_EMAIL=hashyomar@gmail.com
   SUPER_ADMIN_EMAIL=admin@admin.com
   SUPER_ADMIN_PASSWORD=admin
   ```

4. Run the following command to start the application:

   ```bash
   docker-compose up -d --build
   ```

   This will spin up the app along with Postgres and Redis containers.

5. Access the app at `http://localhost:3000`.

## Technologies Used

- **NestJS**: Backend framework.
- **GraphQL**: API query language.
- **Postgres**: Database.
- **Redis**: Caching, pub/sub, and managing email jobs with **BullMQ**.
- **BullMQ**: Job queue management.
- **Docker**: Containerization.
- **SendGrid**: Email service for sending OTPs and notifications.

## Notes

- This project was a learning experience, so you might find some rough edges. 😅
- I tried to keep things simple while focusing on understanding the core concepts.

Feel free to explore, learn, and even improve it! Happy coding! 🎉
