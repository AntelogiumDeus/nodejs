var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF CUSTOMER
app.get('/', function(req, res, next) {
    req.db.collection('customer').find().sort({"_id": -1}).toArray(function(err, result) {
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('customer/listcustomer', {
                title: 'Daftar Customer',
                data: ''
            })
        } else {
            res.render('customer/listcustomer', {
                title: 'Daftar Customer',
                data: result
            })
        }
    })
})

// SHOW ADD CUSTOMER FORM
app.get('/add', function(req, res, next){
    res.render('customer/add', {
        title: 'Tambah Customer',
        customerPo: '',
        price: '',
        deliverablesType: ''
    })
})

// ADD NEW CUSTOMER POST ACTION
app.post('/add', function(req, res, next){
    req.assert('customerPo', 'required').notEmpty()
    req.assert('price', 'required').notEmpty()
    req.assert('deliverablesType', 'required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


        var customer = {
            customerPo: req.sanitize('customerPo').escape().trim(),
            price: req.sanitize('price').escape().trim(),
            deliverablesType: req.sanitize('deliverablesType').escape().trim(),
        }

        req.db.collection('customer').insert(customer, function(err, result) {
            if (err) {
                req.flash('error', err)


                res.render('customer/add', {
                    title: 'Tambah Customer Baru',
                    customerPo: customer.customerPo,
                    price: customer.price,
                    deliverablesType: customer.deliverablesType,
    
                })
            } else {
                req.flash('success', 'Data Berhasil Ditambah!')


                res.redirect('/customer')


            }
        })
    }
    else {   //Display errors
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)


        res.render('Customer/add', {
            title: 'Tambah Customer Baru',
            customerPo: req.body.customerPo,
            price: req.body.price,
            deliverablesType: req.body.deliverablesType,

        })
    }
})

// SHOW EDIT CUSTOMER FORM
app.get('/edit/(:id)', function(req, res, next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('customer').find({"_id": o_id}).toArray(function(err, result) {
        if(err) return console.log(err)

        // if CUSTOMER not found
        if (!result) {
            req.flash('error', 'Customer tidak ada dengan id = ' + req.params.id)
            res.redirect('/customer')
        }
        else { // if customer found

            res.render('customer/edit', {
                title: 'Edit customer',
                //data: rows[0],
                id: result[0]._id,
                customerPo: result[0].customerPo,
                price: result[0].price,
                deliverablesType: result[0].deliverablesType,
                
            })
        }
    })
})

// EDIT CUSTOMER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
  req.assert('customerPo', 'required').notEmpty()           
  req.assert('price', 'required').notEmpty()             
  req.assert('deliverablesType', 'is required').notEmpty() 



    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


        var customer = {
            customerPo: req.sanitize('customerPo').escape().trim(),
            price: req.sanitize('price').escape().trim(),
            deliverablesType: req.sanitize('deliverablesType').escape().trim(),
            
        }

        var o_id = new ObjectId(req.params.id)
        req.db.collection('customer').update({"_id": o_id}, customer, function(err, result) {
            if (err) {
                req.flash('error', err)


                res.render('user/edit', {
                    title: 'Edit User',
                    id: req.params.id,
                    customerPo: req.body.customerPo,
                    price: req.body.price,
                    deliverablesType: req.body.deliverablesType,
                    
                })
            } else {
                req.flash('success', 'Data berhasil diupdate!')

                res.redirect('/customer')


            }
        })
    }
    else {   //Display errors
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)


        res.render('customer/edit', {
            title: 'Edit Customer',
            id: req.params.id,
            customerPo: req.body.customerPo,
            price: req.body.price,
            deliverablesType: req.body.deliverablesType,
            
        })
    }
})

// DELETE customer
app.delete('/delete/(:id)', function(req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('customer').remove({"_id": o_id}, function(err, result) {
        if (err) {
            req.flash('error', err)
            // redirect to customer list page
            res.redirect('/customer')
        } else {
            req.flash('success', 'customer telah terhapus! id = ' + req.params.id)
            // redirect to customer list page
            res.redirect('/customer')
        }
    })
})

module.exports = app;