Bills = new Meteor.Collection('bills');

Template.billList.myBills = function(){
  var today = moment().toDate();
  var threeDaysAgo = moment().subtract(3, 'days').toDate();
  return Bills.find({
    dueDate: {
        $lt: today,
        $gt: threeDaysAgo
    }
  });
};
