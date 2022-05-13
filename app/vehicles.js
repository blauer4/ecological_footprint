/**
 * Gestione listaggio veicoli presenti nel db 
 */

 const express = require('express');
 const router = express.Router();
 const Vehicle = require('./models/vehicle.js').Vehicle; 