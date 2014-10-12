bill-example
============

A sample meteor application showing how to build a simple bill tracking application.

Instructions for building this app (we will be using these for the presentation):

https://gist.github.com/Ellisande/1266a92d7cdb99d9d8cf

The instructions gist content has been pasted below for convinence, however, it is not guarenteed to be in sync. Additionally, if you are starting from the base point of this tutorial, the information will not be present in the readme, since it was added at the end of the project.

instructions gist
=================
#### Introduction

##### App Requirements
The bill tracking application we are building should ultimately do three things.

1. Allow you to view bills
1. Categorize bills by when they are due
 * Late: Due before today
 * Due: Due between today and three days from now
 * Upcoming: Due later than three days from now
2. Allow you to mark bills as paid

Keep those in mind as we build the functionality out in this tutorial.

##### Navigation

Each step of this tutorial is has been tagged along the way. You can skip forward or backward to any step (starting with 3.0) by typing:
```git reset --hard {{step}}```

for instance

```git reset --hard 3.0```

Would bring you to the very beginning of the tutorial, step 3.0. 

```git reset --hard 9.2```

Would bring you to just before the templates for the categories are added.

*Note*: Steps 1 and 2 are not captured because the real work is all done by Meteor, there isn't any intermediate steps to show.

####1.0 Install Meteor: 
https://www.meteor.com/
This exercise is left to the reader. The Meteor site has simple instructions to getting setup. You do need a POSIX based OS to run Meteor at the moment.

####2.0 Create the Project
```meteor create bill-example```
Meteor will create the directory for the project for you, and get everything setup.

####2.3 Boot up your new application
 by moving to the new directory and typing ```meteor```

###2.4 View the App

http://localhost:3000/

####3.0 Organize the Project
Meteor will create a base project for you as you've seen. It create a very simplistic project where the client and server code exists in the same file. Some people like this, but for it generally becomes cumbersome pretty quickly. We're going to reorganize using Meteor's client/server setup.

By convention Meteor will treat code inside the *client* folder as client-side code, and files in the *server* folder as server-side code. Let's get our project set up using that structure.

####3.1 Create a client directory.

* Create a client.js file inside the client directory
* Create a css folder inside the client directory
* Move the generated css file into the css folder
* Create an html folder inside the client directory
* Move the generated html file into the html folder

####3.2 Create a server directory

* Create a server directory.
* Create a server.js file inside the server directory

####4.0 Meteor Modules
Meteor has an easy to use, built in package manager for modules. We are going to be messing with dates, which means moment.js would be extremely useful. Lets grab it!

####4.1 Add Moment
Its pretty easy to add a new module. You can do it easily at the command line. Stop your application, and type the following:
* Add the moment.js ```meteor add mrt:moment```
* Restart your app with ```meteor```

####5.0 Create a Meteor Collection
Collections backed by MongoDB (and MiniMongo) are the main backing data structure for Meteor projects. We need to create one to hold our data.

####5.1 Define Your Data Model
Feel free to decide your own, but for the purposes of this tutorial we'll use the following model for a bill:
```
bill: {
  name: "a name here",
  amount: 0.00,
  dueDate: new Moment().toDate(),
  website: "http://www.google.com",
  paid: false,
  frequency: "month"
}
```

####5.2 Create the Collection
We need to create the collection on both the client side and the server side. This won't make much sense while we're using the default "autopublish" model, but if you delve deeper into Meteor the reason for this will become clear quickly.

* In the server.js file create a *Bills* collection with the following line ```Bills = new Meteor.Collection('bills');```
* In the client.js file create a *Bills* collection with the exact same line ```Bills = new Meteor.Collection('bills');```

####5.3 Setup Some Test Data
Insert several records so we have some test data. You can create your own data or grab some lines from the test data file as part of this gist.

Insert the test data lines into your server.js file. Once your server restarts by itself comment them out, or you will end up with duplicates.

####6.0 Basic View
Lets create some templates and bind data from our collection to the screen. If you are familiar with other Single Page Webapp (SPA) frameworks then this will be a natural concept for you.

####Note: HTML Structure
Meteor will aggregate and minify all the HTML in the project into a single file and serve it up for you. This creates some interesting dynamics for the project. Here are a couple quick notes:

* You can only have one ```<title>``` tag and one ```<body>``` tag across all your HTML files. Generally these will be in a "main" or "landing" HTML file.
* Most of your HTML file will be based on ```<template>``` tags. We'll look at the breakdown of these tags later.

####6.1 Create a Template
Meteor view are based on templates. Lets set one up to show our newly added test data.

* Add a ```<template>``` tag outside of the ```<body>``` tag in the html as a root element. It should look something like this:
```
<template name="billList">
 <h2>All my bills</h2>
 <ul>
  {{#each myBills}}
    <li>{{name}}: {{amount}}</li>
  {{/each}}
 </ul>
</template>
```
* Include the template in the body tag
```
<body>
 {{> billList}}
</body>
```

But... it doesn't work?

You're right. The new template doesn't work yet, in order for it to work we need to define "myBills", see the next section for how we do that.

####7.0 Helpers
Ok, so we have some HTML, but how do we bind data to it? You probably noticed we are looping through myBills, but where does that come from? Helpers are the answer.

Helpers are bound to the templates we created in our HTML, for instance to create a new template helper for our bill list template we'd add the following line:
```
Template.billList.myBills = function(){
  //Your helper code here
};
```
In this example we have a helper call *myBills* associated to the *billList* template. The *myBills* helper will be available in only the context of the *billList* template.

####7.1 Bind myBills
We need to create a helper that returns the entire list of bills for us. We could use the global Bills object, but then it won't be reactive. Using a helper is the way to get around this. In your client.js folder lets add a helper to the *billList* template.

```
Template.billList.myBills = function(){
 return Bills.find();
};
```
Now *myBills* will bind to all the elements in our *Bills* collection. You may want to filter the list, but we'll tackle that later.

####Check the View
Lets go back to ```http://localhost:3000``` and take a look. We should now see a list of all the Bills in our web view. If not, we messed up. I hope we did it right!

####8.0 Query the Data
Alright, now we've got our data showing up on the big screen, lets see if we can get some cool views of the data. If you really want to know how to do this well you need to be familiar with Mongo "query-by-example" style queries. That's outside the scope of this tutorial, but you can easily find lots of documentation over on the Mongo site: http://docs.mongodb.org/manual/reference/operator/

####8.1 Query Paid
Lets change the *myBills* helper to return only unpaid bills. That will look something like this:
```
Template.billList.myBills = function(){
 return Bills.find({paid: false});
};
```
We just pass in an object where paid is false and Mongo will give us back objects that look like that! Yeay!

Check your main view at: http://localhost:3000 again and make sure you see only the unpaid bills.

####8.2 Query by Name
Bills should have a unique name, so lets try to find just one:
```
Template.billList.myBills = function(){
 return Bills.find({name: "Cox"});
};
```

####8.3 Query By Date Range
Lets see if we can get bills with due dates between a certain range.
```
Template.billList.myBills = function(){
 return Bills.find({dueDate: {$lt: moment().toDate(), $gt: moment().subtract(3, 'days').toDate()}});
};
```

####9.0 Categories
Alright, we know how to query data, lets create a couple categories of data in our HTML. We'll use the following three categories:

#### Late
A bill is considered late when the due date is before (less than) today, and is not paid.

#### Due
A bill is considered due when the due date is after (greater than) today and before (less than) 3 days from now, and is not paid.

#### Upcoming
A bill is considered upcoming when the due date is after (greater than) 3 days from now, and is not paid.


####9.1 Create a Bill Template
Lets break down a quick template for different kinds of lists. It'll be quite useful to create a template for a bill that we can add to any list.

* Build a new template for a generic bill of any category.
```
<template name="bill">
 <li>{{name}}: {{amount}}</li>
</template>
```
####9.2 Add List Templates

Just like we did for the original list, let's create some new lists for Late Bills, Due Bills, and Upcoming Bills.
```
<template name="billList>
 <h2>Late Bills</h2>
 <ul>
  {{#each lateBills}}
    {{> bill}}
  {{/each}}
 </ul>
 <h2>Due Bills</h2>
 <ul>
  {{#each dueBills}}
   {{> bill}}
  {{/each}}
 </ul>
 <h2>Upcoming Bills</h2>
 <ul>
  {{#each upcomingBills}}
   {{> bill}}
  {{/each}}
 </ul>
</template>
```
####9.3 Build helpers for Late, Due, and Upcoming
```
Template.billList.lateBills = function(){
  var today = moment().toDate();
  return Bills.find({
    dueDate: {
        $lt: today,
    },
    paid: false
  });
};
```
```
Template.billList.dueBills = function(){
  var today = moment().toDate();
  var threeDaysFromNow = moment().add(3, 'days').toDate();
  return Bills.find({
    dueDate: {
      $lt: threeDaysFromNow,
      $gt: today
    },
    paid: false
  });
};
```
```
Template.billList.upcomingBills = function(){
  var threeDaysFromNow = moment().add(3, 'days').toDate();
  return Bills.find({
    dueDate: {$gt: threeDaysFromNow}
  });
};
```

####10.0 Inputs
Alright, we're in the home stretch now! All we need now to have the basic building blocks is how to deal with inputs.

####10.1 Add a Paid Button
Again we'll use the pattern of building UI first, then binding events. Add a button to the generic bill template with a class of *paid*

```
<template name="bill">
 <li>
   <button class="paid">Paid</button>
   <span>{{name}}: {{amount}}</span>
 </li>
```

####10.2 Bind a Click
When we click on paid we want to get rid of the bill. We could add a new one after that, but lets keep it simple for now. In order to bind an event we need to use the Template(..).events object. An example of binding a click even to the paid button is bellow:
```
Template.bill.events = {
 'click .paid': function(event){
  console.log('Fired');
 }
};
```

####Note:

Here we want to bind an event to the generic bill template, *not* billList. Make sure you add the helper to ```Template.bill``` not ```Template.billList```.

Now go click your paid button and lets see what happens!

####10.3 Do Something Real

Well, we can bind to a click, but now lets give the event context and you know, *do something*. Inside the context of an event *this* refers to the top level element the handlebars template is bound to. Let's delete the bill when we pay it...

```
Template.bill.events = {
 'click .paid': function(event){
   Bills.remove({_id: this._id});
 }
};
```
Notice that we can reference the *bill* this template is bound to with *this*. This is the best way to get access to the context of your event.

####Try it Out!
You should now be able to pay bills!

####Fin
All done! I'll add an extended version later that has a walk through of dealing with text inputs. If you are familiar with using JQuery style selectors and values you can probably extrapolate just fine from the click example, but I'll add it none the less!

I hope you've enjoyed the presentation and the walk through. If you have questions or comments feel free to drop me a line @EllisandePoet.
