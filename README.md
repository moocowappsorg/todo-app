# Todo List Application

A simple, full-stack todo list application that works on your computer and can be deployed online.

## Features

- Add new tasks
- Mark tasks as complete
- Delete tasks
- Clean, mobile-friendly design
- Data saved automatically

## How to Use (Local)

1. Open a terminal and go to the project folder
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and go to: `http://localhost:3000`

That's it! You can now add, complete, and delete tasks. Your data is saved in a file called `todos.db`.

## How It Works

- **Backend**: Node.js with Express - handles the API
- **Database**: SQLite - stores your tasks in a simple file
- **Frontend**: HTML, CSS, and JavaScript - runs in your browser

## Files

- `server.js` - The main server file
- `database.js` - Database setup
- `public/index.html` - The web page
- `public/style.css` - The design
- `public/app.js` - The interactive features
- `todos.db` - Your saved tasks (created automatically)

## Deploying Online

You can deploy this app to services like:
- Vercel
- Railway
- Render

Just connect your GitHub repository and deploy. The database will work, but note that on some free platforms the data may be reset when the app restarts.

## Need Help?

This is a simple app meant for personal use. If you need more features (like user accounts, sharing lists, etc.), you might want to use a more advanced solution.
