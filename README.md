## QSR Custom Order API

This API is designed to store and edit data related to a user's customized order at quick service restaurants (QSR) like Chipotle and &pizza. The goal of the API is to offer a queryable data set into popular orders at a given restaurant chain, orders by users(s), and deep queries into the ingredients that make up a users custom order.

For example, we could query the database (based on ingredients) to determine all the custom orders at Chipotle that are vegan or vegetarian-friendly. An end user could use this information to make diet conscious choices at their favorite restaurants.

![enter image description here](https://www.budimir.dev/header-image.png)

One of the challenges faced with this project is building an efficient organizational structure that allows for the addition of dozens or hundreds of additional schema types for a specific restaurant chain. This proved harder than expected working in a non-relational database.

For example, an order across any restaurant may share a few common properties such as order name, a description, and a user that placed the order. However, two restaurants may offer vastly different ingredients. To account for this we're relating the "Order" schema to a unique "Order Content" schema for every restaurant available in the API. As long as we know what chain is being queried, we can associate an order at that chain with it's unique "Order Content" schema. (See how this is done in the user "typeOfIngredient" GET route below).

### **Initial Data Collection**

At this stage, we've compiled a small subset of orders from only two restaurants (Chipotle and &pizza). Individuals were surveyed via a Google form. Their submissions were seeded to the database.

### **Features**

**Full CRUD Routes**
With the exception of "Chain", the data model used to manage individual restaurants, the API offers the ability to create, read, update and delete records related to the "Orders", "Order Content" and "Users" models.

#### **Routes**

**Chains (Restaurants)**

GET: [https://qsr-order-api.herokuapp.com/api/chains/](https://qsr-order-api.herokuapp.com/api/chains/)

Returns a list of Chains and the Order IDs for custom orders made at that chain.

GET: [https://qsr-order-api.herokuapp.com/api/chains/:chainName](https://qsr-order-api.herokuapp.com/api/chains/Chipotle)

Returns a list of orders a given chain, and also includes order metadata. Such as the user that placed the order and the content of the orders (ingredients).

**Orders**

GET: [https://qsr-order-api.herokuapp.com/api/orders/](https://qsr-order-api.herokuapp.com/api/orders/)

A complete list of orders in the database, including all order metadata.

GET: [https://qsr-order-api.herokuapp.com/api/orders/chain/:chainName](https://qsr-order-api.herokuapp.com/api/orders/chain/Chipotle)

A complete list of orders related to a specific chain.

GET: [https://qsr-order-api.herokuapp.com/api/orders/beans/:typeOfIngredient](https://qsr-order-api.herokuapp.com/api/orders/beans/Black%20Beans)

This request makes it possible to query inside of a subdocument. First, it populates all the information available to use inside of an order. Then it identifies when the order ingredients (in this case, beans) match the query value. Then it pushes those results into JSON as the result.

```
router.get('/beans/:beans',  async  (req, res)  =>  {
	const  chainOrders  = [];
	const  results  = [];
	await  Order.find({},  function(err, data)  {
		data.forEach(function(value)  {
			chainOrders.push(value);
		});
	})
		.deepPopulate(['users',  'orderContent'])
		.populate({ path:  'orderContent'  });
	chainOrders.forEach(order =>  {
		if (order.orderContent[0].beans  ===  req.params.beans) {
			results.push(order);
		}
	});
	res.send(results);
});
```

**Users**

GET: [https://qsr-order-api.herokuapp.com/api/users/all](https://qsr-order-api.herokuapp.com/api/users/all)

Gets all users and populates their order metadata.

POST: [https://qsr-order-api.herokuapp.com/api/users/create/:userFullName](https://qsr-order-api.herokuapp.com/api/users/create/David%20Budimir)

Creates a new user with their full name.

DELETE: [https://qsr-order-api.herokuapp.com/api/users/create/:userFullName](https://qsr-order-api.herokuapp.com/api/users/create/David%20Budimir)

Deletes a selected user based on the provided full name.

**User Orders**

POST: https://qsr-order-api.herokuapp.com/api/user-order/create/

This is an additional controller that was set up to simulate an ideal post to the database if a user was to submit an order for the first time. In this route, we simultaneously create a user and an order.

Then the function dynamically imports the "Order Content" model based on the name of the user's selected restaurant. Finally, the "Order Content" is updated the "Order" gets associated with the corresponding IDs for "Order Content", "User", and "Chain". As a result, we can reliably use the nested query routes described earlier.

```
router.post('/create/',  async  (req, res)  =>  {
	User.create(req.body.user).then(createdUser =>  {
		Order.create(req.body.order).then(createdOrder =>  {
			const  OrderContent  =  require(`../db/models/${createdOrder.contentSchema}.js`);
			OrderContent.create(req.body.order).then(async createdOrderContent =>  {
				Chain.findOne({ name:  createdOrder.chainName  })
					.then(async updatedChain =>  {
						updatedChain.orders.push(createdOrder._id);
						createdOrder.chain.push(updatedChain._id);
						updatedChain.save();
					})
					.then(async  ()  =>  {
						createdUser.orders.push(createdOrder._id);
						createdOrder.orderContent.push(createdOrderContent._id);
						createdOrder.users.push(createdUser._id);

						createdUser.save();
						createdOrder.save();
						createdOrderContent.save();
					})
					.then(()  =>  res.json(createdOrder));
			});
		});
	});
});
```

### **Future Additions**

**Improved Deep Queries:**
Today the functionally exists to run a deep query on an individual property in order. (What kind of beans, what meal type, etc.) An ideal next step is to build functionally that checks against a number of parameters before sending a result.

This would make it possible for us to return all custom orders regardless of chain to and return all (vegetarian, vegan, keto friendly, paleo, etc.) orders.

**Tagging:**
With better deep queries we could analyze an order as it comes in and applies new data properties for the previously mentioned categories. This would make it possible to query based new categories more efficiently.

With some effort, tags could be applied by users as a way to curate a "playlist" of custom orders.

### **Technologies Used**

**Javascript**
**Express**
**Mongoose**
**MongoDB**
**Mongo.Atlas**
**Heroku**

### **What's In the Repo?**

**/controllers**

-  chains.js
-  orders.js
-  users.js
-  user-orders.js

**/db**

-  /models
-  /seeds
-  connection.js
-  seed.js

**/planning:** Files and images created during the brainstorm and planning phase of this project.

**index.js**

#### Contribution Guidelines

Fork and clone this repo, contribute from a new branch.

-  API: [https://qsr-order-api.herokuapp.com/api/chains/](https://qsr-order-api.herokuapp.com/api/chains/)
-  Main repository: [https://github.com/dbudimir/qsr-order-api](https://github.com/dbudimir/qsr-order-api)
-  Issue tracker: [https://github.com/dbudimir/qsr-order-api/issues](https://github.com/dbudimir/qsr-order-api)

Contact me: [dav.budimir@gmail.com](mailto:dav.budimir@gmail.com)
