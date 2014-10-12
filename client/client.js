Bills = new Meteor.Collection('bills');

Template.billList.lateBills = function(){
  var today = moment().toDate();
  return Bills.find({
    dueDate: {
        $lt: today,
    },
    paid: false
  });
};

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

Template.billList.upcomingBills = function(){
  var threeDaysFromNow = moment().add(3, 'days').toDate();
  return Bills.find({
    dueDate: {$gt: threeDaysFromNow}
  });
};

Template.bill.events = {
  'click .paid': function(event){
    console.log('Fired');
  }
};
