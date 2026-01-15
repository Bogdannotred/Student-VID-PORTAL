# University Document Management System - Frontend Application

---
> ### **Note:** This is the frontend part of the University Document Management System. The main `README.md` is in the root of the project.
---

A web application for managing student documents at a university.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Contributing](#contributing)

## About the Project



This project is a web-based application designed to streamline the process of managing student documents within a university. It provides a centralized platform for students to upload, and administrators to review and manage academic documents. The goal is to create an efficient, user-friendly, and secure system for handling various types of student records.



<img src="../images/HomePage.png" width="500"/>



<img src="../images/Admin%20Panel%20Main.png" width="500"/>



<img src="../images/Create%20User.png" width="500"/>



<img src="../images/Student%20Management.png" width="500"/>



<img src="../images/upload%20document.png" width="500"/>



## Features

- **User Authentication:** Secure login for students and administrators.

- **Document Upload:** Students can upload various document types.

- **Document Management:** Administrators can view, and manage uploaded documents.

- **User Profile:** Students can view and update their profile information.

- **Admin Panel:** A dedicated interface for administrators to manage users and documents.



## Getting Started



To get a local copy up and running, follow these simple steps.



### Prerequisites



- npm

  ```sh

  npm install npm@latest -g

  ```



### Installation



1. Clone the repo

   ```sh

   git clone https://github.com/your_username_/Project-Name.git

   ```

2. Install NPM packages

   ```sh

   npm install

   ```

3. Create a `.env.local` file in the `frontend` directory and add your Supabase credentials:

   ```

   VITE_SUPABASE_URL=YOUR_SUPABASE_URL

   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

   ```

4. Start the development server

   ```sh

   npm run dev

   ```



## Project Structure



```

/frontend

|-- public/

|   |-- vite.svg

|-- src/

|   |-- assets/

|   |-- components/

|   |-- contexts/

|   |-- lib/

|   |-- pages/

|   |-- routes/

|   |-- App.css

|   |-- App.jsx

|   |-- index.css

|   |-- main.jsx

|-- .gitignore

|-- index.html

|-- package.json

|-- vite.config.js

...

```



## Technologies Used



* [React](https://reactjs.org/)

* [Vite](https://vitejs.dev/)

* [Supabase](https://supabase.io/)

* [Tailwind CSS](https://tailwindcss.com/)



## Usage



Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.



## Contributing



Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.



1. Fork the Project

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the Branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

