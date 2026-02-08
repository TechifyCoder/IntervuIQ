# IntervuIQ

IntervuIQ is a comprehensive MERN stack application designed to facilitate intelligent interviewing processes. It leverages modern technologies like Stream for video/chat capabilities, Clerk for authentication, and Inngest for background event processing.

## 🚀 Tech Stack

-   **Frontend:** React (Vite), TailwindCSS, DaisyUI, Clerk (Auth), Stream (Video/Chat)
-   **Backend:** Node.js, Express, Mongoose (MongoDB), Inngest
-   **Database:** MongoDB
-   **Authentication:** Clerk
-   **Real-time:** Stream

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [MongoDB](https://www.mongodb.com/) database
-   A [Clerk](https://clerk.com/) account
-   A [Stream](https://getstream.io/) account

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TechifyCoder/IntervuIQ.git
    cd IntervuIQ
    ```

2.  **Install Dependencies:**
    You can install dependencies for both backend and frontend from the root, or individually.

    *Root (using the build script):*
    ```bash
    npm run build
    ```
    *Or individually:*
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

## ⚙️ Configuration

You need to set up environment variables for both the backend and frontend.

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Authentication (Clerk) & Stream
# (Note: Clerk keys might be needed here depending on your specific backend logic, 
# typically INNGEST and STREAM keys are essential)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SINGING_KEY=your_inngest_signing_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# Usually public keys are safe in frontend, but ensure you use the correct publishable key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Project

1.  **Start the Backend:**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

The frontend should be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
