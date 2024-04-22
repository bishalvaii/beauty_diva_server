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

const username = 

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
      price: 20,
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
      price: 30,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 4,
      name: 'Product 4',
      description: 'Description for Product 1',
      price: 36,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 5,
      name: 'Product 5',
      description: 'Description for Product 2',
      price: 40,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },    },
    {
      id: 6,
      name: 'Product 6',
      description: 'Description for Product 3',
      price: 28,
      image: {
        url: '/lipstick.png',
        width: 300, // Add width property for the image
        height: 250, // Add height property for the image
      },   },
    {
      id: 7,
      name: 'Product 7',
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
      const newUser = await pool.query('INSERT INTO users (username, email, password, isAdmin) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, password, false]);
  
      
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
    const userInfo = user.rows[0];
    const userData = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      isAdmin: userInfo.isadmin, // Make sure isAdmin property is included
    };
    res.status(200).json({ message: 'Login successful', user: userData })


  } catch(error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/admin/orders', async (req, res) => {
  try {
    const query = `
   
    SELECT
    o.id AS order_id,
    o.username,
    o.total_amount,
    o.created_at AS order_created_at,
    ARRAY_TO_STRING(ARRAY_AGG(od.product_id), ',') AS product_id,
    ARRAY_TO_STRING(ARRAY_AGG(od.quantity), ',') AS quantity,
    s.mobile_number,
    s.address,
    s.payment_gateway
FROM
    orders o
JOIN
    order_details od ON o.id = od.order_id
JOIN
    shipping_details s ON o.id = s.order_id
GROUP BY
    o.id,
    o.username,
    o.total_amount,
    o.created_at,
    s.mobile_number,
    s.address,
    s.payment_gateway
ORDER BY
    o.created_at DESC`;


    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//endpoint for checkout

app.post('/api/checkout', async (req, res) => {
  try {
    const { products, totalAmount,username  } = req.body;
     // Step 1: Get the user ID from the database using the username
    const orderInsertResult = await pool.query({
      text: 'INSERT INTO orders (username, total_amount) VALUES ($1, $2) RETURNING id',
      values: [username, totalAmount],
    });   

    const orderId = orderInsertResult.rows[0].id; // Retrieve the inserted order id
    

    // Step 2: Insert order details into the order_details table
    for (const product of products) {
      // const total_price = product.quantity * product.unitPrice;
      await pool.query({
        text: 'INSERT INTO order_details (order_id, product_id, quantity, total_price,username) VALUES ($1, $2, $3, $4, $5)',
        values: [orderId, product.id, product.quantity, totalAmount, username],
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

  //address endpoint 
  app.post('/api/shipping-details', async(req, res) => {
    try {
      const {fullName, mobileNumber, province, city, toleName, paymentGateway, address,orderId} = req.body

      const newShippingDetails = await pool.query(
        'INSERT INTO shipping_details (full_name,address, mobile_number, province, city,tole_name, payment_gateway, order_id) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *',
         [fullName,address, mobileNumber, province, city, toleName, paymentGateway, orderId]
      
        );
        res.status(201).json({ message: 'Shipping details added successfully', shippingDetails: newShippingDetails.rows[0] });
    } catch (error) {
      console.error('Error adding shipping details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
  })

  app.post('/verify-transaction', async (req, res) => {
    const { total_amount, transaction_uuid, product_code, signature } = req.body;

    // Verify signature using HMAC/SHA256 algorithm
    const generatedSignature = generateSignature(total_amount, transaction_uuid, product_code);
    if (signature !== generatedSignature) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    // Perform transaction verification with eSewa
    // Send request to eSewa endpoint and process the response

    // For demonstration purposes, assume verification is successful
    const transactionStatus = 'SUCCESS';
    res.json({ status: transactionStatus });
});

// Function to generate HMAC/SHA256 signature
function generateSignature(total_amount, transaction_uuid, product_code) {
    const secretKey = '8gBm/:&EnhH.1/q'; // SecretKey provided by eSewa
    const data = `total_amount=${total_amount}&transaction_uuid=${transaction_uuid}&product_code=${product_code}`;
    return crypto.createHmac('sha256', secretKey).update(data).digest('base64');
}
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
