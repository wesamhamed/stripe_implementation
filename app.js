const express = require("express");
const path = require("path");
const keys = require("./config/keys")
const exphbs = require("express-handlebars");
const stripe = require("stripe")(keys.stripeSecretKey);
const app = express();
//Constants
const PORT = process.env.PORT || 3000;

//Handlebars Middleware
app.engine('.hbs', exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", {
        stripePublishableKey: keys.stripePublishableKey
    })
});

app.post("/charge", (req, res) => {
    // console.log(req.body);
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description: "Web Development Ebook",
        currency: 'usd',
        customer: customer.id
    })).then(charge => res.render("success")).catch(console.log)
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})