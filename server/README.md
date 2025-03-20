# Electra Admin Dashboard Backend

This is the backend server for the Electra Admin Dashboard application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/electra-admin
```

3. Start MongoDB:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo service mongod start
```

## Development

To run the server in development mode with hot reloading:
```bash
npm run dev
```

## Production

To build and run the server in production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order
- `GET /api/orders/status/:status` - Get orders by status

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:
```json
{
  "message": "Error message here"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 