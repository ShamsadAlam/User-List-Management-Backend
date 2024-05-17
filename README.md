# User List Management and Email Sending API

This project is a RESTful API for managing a list of users with customizable properties and sending personalized emails to users. The API is built using Node.js, Express, and MongoDB.

## Features

- **List Creation:** Admin can create a list with a title and custom properties.
- **User Addition:** Admin can add users to the list via CSV upload.
- **CSV Handling:** Handles CSVs with headers for 'name' and 'email' (required) and custom properties.
- **Unique Emails:** Ensures no duplicate emails within a list.
- **Error Handling:** Returns errors in a CSV format if some users are not added.
- **Email Sending (Bonus):** Admin can send personalized emails to the entire list.
- **Unsubscribe Feature (Bonus):** Users can unsubscribe from the list.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Nodemailer

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShamsadAlam/User-List-Management-Backend.git
   cd User-List-Management-Backend
