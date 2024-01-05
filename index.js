const express = require("express")
const uuid = require("uuid")
const port = 3001
const app = express()

app.use(express.json())

const orders = [];

const checkOrderId = (req, res, next) => {
    const { id } = req.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return res.status(404).json({ error: "User not found" })
    }

    req.orderIndex = index
    req.orderId = id

    console.log(req.orderIndex)
    next()
}

/* const logging = (req, res, next) => {
    console.log(req)
    next()
} */


app.get('/order', (req, res) => {
    return res.json(orders)
})

app.post('/order', (req, res) => {
    const { clientName, order, price } = req.body
    const orderClient = { clientName, order, price, id: uuid.v4(), status: 'Em preparação' }

    orders.push(orderClient)

    return res.status(201).json(orderClient)

})


app.put('/order/:id', checkOrderId, (req, res) => {
    const id = req.orderId
    const index = req.orderIndex

    const { clientName, order, price } = req.body

    const updateOrder = { clientName, order, price, id }

    orders[index] = updateOrder

    return res.json(updateOrder)
})

app.delete('/order/:id', checkOrderId, (req, res) => {
    const index = req.orderIndex
    orders.splice(index, 1)

    return res.status(204).json({ message: "Order Deleted" })
})

app.get('/order/:id', checkOrderId, (req, res) => {
    const index = req.orderIndex
    return res.status(200).json(orders[index])
})


app.listen(port, () => {
    console.log(`Server Started On Port ${port}`)
})