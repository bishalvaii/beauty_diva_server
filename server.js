// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
// Serve static files (including images)
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all routes
app.use(cors());

// Middleware to parse request body
app.use(bodyParser.json());
// Define your products data
const products = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description for Product 1',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description for Product 2',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },
        },
    {
      id: 3,
      name: 'Product 3',
      description: 'Description for Product 3',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 4,
      name: 'Product 1',
      description: 'Description for Product 1',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 5,
      name: 'Product 2',
      description: 'Description for Product 2',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 6,
      name: 'Product 3',
      description: 'Description for Product 3',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    {
      id: 7,
      name: 'Product 1',
      description: 'Description for Product 1',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    {
      id: 8,
      name: 'Product 2',
      description: 'Description for Product 2',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    {
      id: 9,
      name: 'Product 3',
      description: 'Description for Product 3',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    {
      id: 10,
      name: 'Product 1',
      description: 'Description for Product 1',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    {
      id: 11,
      name: 'Product 2',
      description: 'Description for Product 2',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 12,
      name: 'Product 3',
      description: 'Description for Product 3',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    // Add more products as needed
  ];
  

// Endpoint to get products data
app.get('/api/products', (req, res) => {
  res.json(products);
});

//login endpoint 



// Signup endpoint

app.post('/api/signup', async (req, res) => {
    try {
      // Extract form data from request body
      const {  username, email, password } = req.body;
  
      // Check if the username already exists in the database
      const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Insert new user into the database
      const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
  
      
      console.log(userIdCounter)
      // Respond with success message and user data
      res.status(200).json({ message: 'Signup successful', user: newUser.rows[0] });
     
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

   // endpont for login

app.post('/api/login', async(req,res) => {
  try {
    const {username, password} = req.body;
    const user = await pool.query('SELECT * FROM users WHERE username= $1 AND PASSWORD = $2', [username, password])
    if(user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password'})
    }
    res.status(200).json({ message: 'Login successful', user: user.rows[0] })


  } catch(error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//endpoint for checkout
let userIdCounter = 1;
app.post('/api/checkout', async (req, res) => {
  try {
    const { products, totalAmount  } = req.body;
    let userId = userIdCounter++;
    

    
    

    const orderInsertResult = await pool.query({
      text: 'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id',
      values: [userId, totalAmount],
    });   

    const orderId = orderInsertResult.rows[0].id; // Retrieve the inserted order id
    userId++

    // Step 2: Insert order details into the order_details table
    for (const product of products) {
      // const total_price = product.quantity * product.unitPrice;
      await pool.query({
        text: 'INSERT INTO order_details (order_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)',
        values: [orderId, product.id, product.quantity, totalAmount],
      });
    }

    res.status(200).json({ message: 'Order placed successfully', orderId: orderId });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  app.get('/users', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
