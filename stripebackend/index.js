const cors = require('cors')
const express = require('express')
const res = require('express/lib/response')
const { regexpToText } = require('nodemon/lib/utils')
const stripe = require('stripe')("sk_test_51KTeUySGGJkJf3gWEqbNm2eAP9wRCRDaPbjdrOC0qL8xjpXGRNmrvq9d91xdmgmNMnqkFrxWoiiKBsbCwQhfPozJ00dzLSS1BM")
const uuid = require('uuid/v4')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("route of backend index.js is working")
})

app.post("/payment",(req,res)=>{
    const {product,token} = req.body
    console.log('product',product)
    console.log('price',product.price)
    const idempontencyKey = uuid()
    return stripe.customers.create({
        email:token.email,
        source:token.id
    })
    .then(customer => {
        stripe.charges.create({
            amount:product.price*100,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            description:product.name,
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        },{idempontencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))
 })

app.listen(8282,()=>console.log('listening at port 8282'))