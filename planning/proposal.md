# Initial Brainstorm

**3 Models**

Restaurant (can have many orders) -> Orders (can have many users) -> Users

**Restaurant** (can have infinite orders)

Name
Cuisine
OrderModel (referencing Order Model)

**Chipotle Order** (order can only have one restaurant, can have many users)

Meal Type (String)
Fillings (String)
Rice (String)
Beans (String)
Toppings (Array)
Order Name
Restaurant (referencing Restaurant)

**&Pizza Order**

**User**

First Name
Last Name
Email
Orders (referencing Orders)

---

**CRUD**

Get any order
Get orders by restaurant
Get orders with topping
Get orders by user
Create orders (in Postman)
Update orders
Delete orders

My goal is to query the orders based on ingredients to return orders that are friendly to specific diet types.

-  vegetarian
-  vegan
-  paleo
-  kito
-  etc.

Ultimately you could create automatically generated pages with restaurant orders that cater to a specific niche.
