# Real-Time Message Board

A full-stack, real-time message board application built with Node.js, Express, Handlebars, and Socket.IO. The application features user authentication using bcrypt for secure password hashing and SQLite for database management.

## Features

- **User Authentication**: Secure user registration and login system with passwords hashed via `bcrypt` and tracked using cookies.
- **Message Board**: Authenticated users can post messages that are viewable by everyone on the platform.
- **Real-Time Updates**: Integrated with `Socket.IO` to broadcast new messages to all connected clients instantly without requiring a page reload.
- **Data Persistence**: Uses a lightweight `SQLite` database to store user accounts and message history.
- **Templating Engine**: Employs `express-handlebars` for dynamic HTML rendering on the server side.

## Technical Stack

- **Backend**: Node.js, Express.js
- **Frontend Engine**: Handlebars
- **Database**: SQLite3
- **Security**: bcrypt (password hashing), cookie-parser
- **Real-Time Communication**: Socket.IO

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hbhanus2/messageboardLgIn.git
   cd messageboardLgIn
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   Ensure the `database` folder exists and contains `messageboard.db`. *Note: If the DB is missing, you must create a new SQLite database with the appropriate tables (`users` and `messages`).*

4. **Start the server:**
   ```bash
   node index.js
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:8000`.

## Project Structure

- `index.js`: Main server file where routes, Express configurations, and Socket.IO are set up.
- `views/`: Handlebars templates (`home`, `login`, `register`, and `layouts/main`).
- `public/`: Static files such as CSS.
- `database/`: Contains the SQLite database file.
- `socket-client.js`: Client-side logic to handle incoming real-time messages via Socket.IO.

## Author
**Harsh Bhanushali**
