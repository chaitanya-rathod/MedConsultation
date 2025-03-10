# MedConsult - Medical Consultation Platform

![MedConsult Logo](https://img.shields.io/badge/MedConsult-Telemedicine%20Platform-00796b)
![Version](https://img.shields.io/badge/version-1.0.0-blue)


## ⚠️ DISCLAIMER

**EDUCATIONAL PURPOSE ONLY**

This project is developed strictly for educational and demonstration purposes only. It is NOT intended for actual medical use or deployment in real healthcare settings.

- This is a prototype/demo application and should NOT be used for real medical consultations
- No actual medical advice should be given or received through this platform
- The developers and contributors assume NO responsibility for any misuse of this software
- This application does NOT comply with HIPAA or other healthcare regulations
- Any use of this software for actual medical purposes is strictly prohibited
- Users acknowledge that they use this code at their own risk

MedConsult is a comprehensive telemedicine platform that connects patients with healthcare providers for virtual consultations. The platform enables secure video consultations, real-time chat, prescription management, and appointment scheduling.

## 🌟 Features

### For Patients
- 👨‍⚕️ Find and book appointments with qualified doctors
- 📅 Manage upcoming and past consultations
- 💬 Real-time chat with healthcare providers
- 📹 Secure video consultations
- 📝 Access and download prescriptions
- 👤 Manage personal health profile

### For Doctors
- 📊 Dashboard with upcoming appointments and patient statistics
- 📅 Manage consultation schedule
- 💬 Communicate with patients via chat
- 📹 Conduct video consultations
- 📝 Create and manage prescriptions
- 👨‍⚕️ Manage professional profile and specializations

## 🚀 Technologies Used

### Frontend
- **React.js** - Frontend library for building user interfaces
- **Material-UI** - React component library implementing Google's Material Design
- **Socket.io-client** - Real-time bidirectional event-based communication
- **Simple-Peer** - WebRTC video/voice/data channels
- **Axios** - Promise-based HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (v4.x or later)

## 🔧 Installation

### Clone the repository
```bash
git clone https://github.com/yourusername/medconsult.git
cd medconsult
```

### Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configure environment variables
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medconsult
JWT_SECRET=your_jwt_secret
```

## 🏃‍♂️ Running the Application

### Development mode
```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

### Production mode
```bash
# Build the client
cd client
npm run build

# Start the server in production mode
cd ../server
npm start
```

## 📱 Application Structure

```
medconsult/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context providers
│       ├── pages/          # Application pages
│       ├── App.js          # Main application component
│       └── index.js        # Entry point
│
└── server/                 # Node.js backend
    ├── config/             # Configuration files
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    └── server.js           # Entry point
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in local storage and included in the Authorization header for API requests.

## 🎥 Video Consultation

Video consultations are implemented using WebRTC through the Simple-Peer library. The connection is established using a signaling server built with Socket.io.

Features include:
- Camera and microphone toggle
- End call functionality
- Real-time chat during consultation

## 💬 Real-time Chat

The chat functionality is implemented using Socket.io, allowing for real-time communication between patients and doctors.

## 📝 Prescriptions

Doctors can create digital prescriptions after consultations, which patients can view and download.

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/profile` - Get user profile

### Consultations
- `GET /api/consultations` - Get all consultations for the user
- `GET /api/consultations/:id` - Get a specific consultation
- `POST /api/consultations` - Create a new consultation
- `PUT /api/consultations/:id/status` - Update consultation status
- `POST /api/consultations/:id/messages` - Send a message in consultation

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get a specific doctor

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions for the user
- `GET /api/prescriptions/:id` - Get a specific prescription
- `POST /api/prescriptions` - Create a new prescription

## 🧪 Testing

```bash
# Run tests for the client
cd client
npm test

# Run tests for the server
cd ../server
npm test
```

## 🔍 Troubleshooting

### Video Call Issues
- Ensure your browser has permission to access camera and microphone
- Check that you're using a supported browser (Chrome, Firefox, Edge)
- Make sure your firewall isn't blocking WebRTC connections

### Chat Not Working
- Verify that the WebSocket connection is established
- Check your internet connection
- Ensure the server is running properly

## 🛣️ Roadmap

- [ ] Mobile application (React Native)
- [ ] Integration with electronic health records (EHR)
- [ ] Payment gateway integration
- [ ] Advanced analytics for doctors
- [ ] AI-powered symptom checker

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or suggestions, please reach out to:
- Email: chaitanya.rathod811@gmail.com


---

by Chaitanya Rathod 
