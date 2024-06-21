const helmet = require('helmet')
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('../middleware/error')

// Routers 
const authRouter = require('../api/auth/auth');
const productsRouter = require('../api/products/product_actions');
const brandsRouter = require('../api/brands/brand_actions');


module.exports = function (app) {
  // Middlewares

  const corsOptions = {
    exposedHeaders: 'bearer-token',
  };
  
  app.use(cors(corsOptions));

  app.use(helmet()); // Security
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/auth", authRouter);
  app.use("/products", productsRouter);
  app.use("/brands", brandsRouter);

  app.get('/', (req, res) => {
    res.send('Server up!')
  })  

  // Error Middleware
  app.use(errorMiddleware);
};
