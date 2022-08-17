var express = require('express');
var glob = require("glob");
var fs = require("fs");
var Order = require('../models/order');

var router = express.Router();

// Return all orders
router.get('/api/orders', function(req, res, next) {
    Order.find(function(err, orders) {
        if (err) { return next(err); }
        res.json({'orders': orders});
    });
});

// Return specific order by ID
router.get('/api/orders/:id', function(req, res, next) {
    var id = req.params.id;
    Order.findById(id, function(err, order) {
        if (err) { return next(err); }
        if (order === null) {
            return res.status(404).json({'message': 'Order with id ${id} not found'});
        }
        res.json(order);
    });
});

// Delete all orders
router.delete('/api/orders', function(req, res, next) {
    Order.deleteMany({})
        .catch(function(error){
            console.log(error);
            return res.status(500).json({'message': 'Error while clearing database: '+error});
    });
    return res.status(200).json({'message': 'ok'});
});

// Delete an order given an ID
router.delete('/api/orders/:id', function(req, res, next) {
    var id = req.params.id;
    Order.findOneAndDelete({_id: id}, function(err, order) {
        if (err) { return next(err); }
        if (order === null) {
            return res.status(404).json({'message': 'Order not found'});
        }
        res.json(order);
    });
});

// Add a new order
router.post('/api/orders', function(req, res, next) {
    var neworder = new Order(req.body);
    neworder.save(function (error) {
        if (error) {
            console.log('Error storing object: '+error);
            return res.status(400).json({'message': 'Error storing object: '+error});
        }
    });
    return res.status(201).json(neworder);
});

// Update an order given an ID
router.patch('/api/orders/:id', function(req, res, next) {
	var id = req.params.id;
	Order.findById(id, function(err, order){
		if(err) { return next(err); }
        if(order == null) {
            return res.status(404).json({'message': 'Order with id ${id} not found'});
        }
        order.orderRef = (req.body.orderRef || order.orderRef);
        order.totalPrice = (req.body.totalPrice || order.totalPrice);
        order.orderStatus = (req.body.orderStatus || order.orderStatus);
        order.productsList = (req.body.productsList || order.productsList);
        order.save();
        res.json(order);
	});
});

module.exports = router;
