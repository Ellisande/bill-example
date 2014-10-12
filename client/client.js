Bills = new Meteor.Collection('bills');

Template.billList.myBills = function(){
  return Bills.find({name: 'Cox'});
};
