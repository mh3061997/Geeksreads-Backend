const mongoose = require('mongoose');
const express = require('express');
const {Status,validate} = require('../models/Statuses');
const {User} = require('../models/User');
const {Book} =require('../models/Book');
const {review} = require('../models/reviews.model');
const {comment}=require('../models/comments.model');
const auth = require('../middleware/auth');
const Joi = require('joi');
const {Notification}= require('../models/Notifications');
//const auth = require('../middleware/auth');
const router = express.Router();



/**
 * @api{Post} /user_status/ Update user status
 * @apiVersion 0.0.0
 * @apiName UpdateUserStatuses
 * @apiGroup Status
 *
 * @apiParam {string} StatusID status id
 * @apiParam {string} UserID User id
 * @apiparam {String} StatusBody the body of this status
 * @apiparam {datePicker} StatusDate the date when the status was written
 * @apiparam {string} CommentId comment id <code>(optional)</code>
 * @apiparam {string} ReviewId <code>(optional)</code>
 *
 *  @apiSuccess {boolen} UpdateSucc  if the update happend successfully or not
 *
 * @apiSuccessExample  Expected Data on Success
 * {
 *  "UpdateSucc": true
 * }
 * @apiError User-Not-Found The <code>User</code> was not found
 * @apiError Status-Not-Found The <code>Status</code> was not found
 */

router.post("/",(req,res)=>
{

 if (req.body.length == 0)
 {
    return res.status(400).send("No parameters was sent")
 }


 var  newStatus = new Status(
   {
   "StatusId":req.body.StatusId,
    "UserId":req.body.UserId,
    "ReviewId":req.body.ReviewId,
    "CommentId":req.body.CommentId,
   "StatusBody":req.body.StatusBody,
    "StatusDate":req.body.StatusDate
   });

  const {error} = validate(newStatus.body);
  if (error) return res.status(400).send(error.details[0].message);


   Status.findOne({'StatusId': newStatus.StatusId},(err,doc)=>
   {
    if(doc)
    {
   return res.status(400).send("already exist");
    }
    newStatus.save()
    res.status(200).send(
        {
            UpdateSucc : true
        }
    );
   });


});
  /**
 * @api{Get} /user_status/show Get User Status
 * @apiVersion 0.0.0
 * @apiName GetUserStatuses
 * @apiGroup Status
 * @apiHeader {String} x-auth-token Authentication token
 *
 * @apiSuccess {string} StatusType  Wheather  it is Comment or Review or Rate
 * @apiSuccess {string} StatusId status id
 * @apiSuccess {string} UserId User id the user who is to see the status
 *
 * @apiSuccess {string} CommentId comment id if the type is comment <code>(optional)</code>
 * @apiSuccess {string} CommentBody Comment the comment body 
 * @apiSuccess {date} CommentDate The date of the comment
 * @apiSuccess {Number}  CommentLikesCount number of people liked this comment
 *  
 * 
 * @apiSuccess {string} BookId the Id of the book rated or reviewed
 * @apiSuccess {string} BookName the name (title) of the book rated or reviewed
 * @apiSuccess {string} BookPhoto the URL of the cover Photo of the book rated or revied
 * @apiSuccess {Number} NumberOfStars the number of stars in case of rating a book
 * 
 * @apiSuccess {string} ReviewId  review Id  alawys exisit weather the type is comment or review
 * @apiSuccess {string} ReviewBody Review Body in case of comment on review or reviews a book 
 * @apiSuccess {date}  ReviewDate the date of the review
 * @apiSuccess {Number}  ReviewLikesCount numbr of the people who liked the the review
 * 
 * @apiSuccess {string} MakerId the id of the user who made the status( Commented or rated or reviewd)
 * @apiSuccess {string} MakerPhoto the URL of the Photo of the User who did the thing ( Commented or rated or reviewd)
 * @apiSuccess {string}  MakerName the Name of the User Who made the status ( Commented or rated or reviewd)
 * 
 *  @apiSuccessExample  Expected Data on Success
 * {
 *
 *  StatusType : Review
 * "StatusId" : "82978363763"
 * "MakerId" : "shjfhghdsg"
 * "UserId" : "82sdfd8363763"
 * "ReviewId" : "82gf8363763"
 * "ReviewLikesCount": 11,
 *           "body": "Hello World !",
 *           
 *
 * },
 * {
 *
 * type : Comment
 * CommentId : "hisadsfjhdld"
 * StatusId : "82978363763"
 * MakerId : "shjfhghdsg"
 * UserId : "82sdfd8363763"
 * ReviewId : "82gf8363763"
 * .......
 * },.....
 * @apiErrorExample {json} NotFound statuses:
 *     HTTP/1.1 400
 *  {
 *    "ReturnMsg":"No statuses were found"
 *  }
 *
 * @apiErrorExample {json} Invalidtoken-Response:
 *     HTTP/1.1 400
 *   {
 *      "ReturnMsg":'Invalid token.'
 *   }
 *
 * @apiErrorExample {json} NoTokenSent-Response:
 *     HTTP/1.1 401
 * {
 *   "ReturnMsg":'Access denied. No token provided.'
 * }
 * @apiError User-Not-Found The <code>User</code> was not found
 * @apiError Status-Not-Found The <code>Status</code> was not found
 */


router.get("/show",auth ,(req,res)=>
{
     if(req.body.UserId==null)
     {
        return  res.status(400).send("Bad request no UserID  Id is there");
    }

      if (req.body.UserId.length == 0)
     {
       return  res.status(400).send("Bad request no Satatus Id is there");
     }


  Status.find( {'UserId':req.body.UserId},(err,doc)=>

   {
    if(!doc)
    {
   return res.status(404).send("No statuses were found");
    }
    if(doc.lenght==0)
    {
   return res.status(404).send("No statuses were found");
    }

    res.status(200).send(
        doc
    )
   }
)


});/**
* @api{Post} /user_status/delete Delete User Status
* @apiVersion 0.0.0
* @apiName DeleteStatus
* @apiGroup Status
*
* @apiParam {string} StatusId Status id
*
* @apiSuccess {boolen} DeleteStatusSuc  if the delete happend successfully or not
* @apiSuccessExample  Expected Data on Success
* {
* "DeleteSTatusSuc": true
* }
* @apiError Status-Not-Found The <code>StatusID</code> was not found
*/
router.post("/delete",(req,res)=>
{
     if(req.body.StatusId==null)
     {
        return  res.status(400).send("Bad request no statusID  Id is there");
    }

      if (req.body.StatusId.length == 0)
     {
       return  res.status(400).send("Bad request no Satatus Id is there");
     }


  Status.findOneAndRemove( {'StatusId':req.body.StatusId},(err,doc)=>

   {
    if(!doc)
    {
   return res.status(404).send("Status Not found");
    }
    if(doc.lenght==0)
    {
   return res.status(404).send("Statuses Not found for this User");
    }

    res.status(200).send(
   {
       "DeleteSTatusSuc" : true

    }
    )
   }
)


});
/**
 * Creating new statuses.
 * @constructor
 * @param {string} FollowerId - the Id of the ppl who will see the statuses in his new feed.
 * @param {string} MakerId- the id of the user who made the action.
 * @param {string} ReviewId - the id of the review 
 * @param {string} Comment1Id - the id of the comment
 * @param {string} Type - the type of the statuses its one of three ( Rate, Review ,Comment) stick with the naming
 * @param {string} Book1Id the Id of the book (review or rated)
 * @param {string} NumberOfStars if rating must send number of stars
 * 
 */

function CreatStatuses( FollowerId ,ReviewId , Comment1Id, Type, MakerId, NumberOfStars, Book1Id )
{
// basic infos
  var  newStatus = new Status(
    {
      "UserId":FollowerId,
      "StatusType":Type, 
    });
    newStatus.StatusId=newStatus._id;
//get the Maker Infos//
    User.findOne({UserId:MakerId},(err,doc )=>
    {
      if (!doc)
      {
        return console.log("Wrong Maker Id")
      }
      else{
        newStatus.MakerId=doc.UserId;
        newStatus.MakerPhoto=doc.Photo;
        newStatus.MakerName =doc.UserName;    
      }

    });
/////////////////////////////////////////
//////// three types/////////////////
//////////////////////////////////////////
/////review//////
if ( type == "Review")
{
review.findOne({reviewId:ReviewId},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong review Id")
  }
  else
  {
    newStatus.ReviewId=doc.reviewId;
    newStatus.ReviewBody=doc.reviewBody;
    newStatus.ReviewDate=doc.reviewDate;
    newStatus.ReviewLikesCount= doc.likesCount;
  
  }

});

  Book.findOne({BookId:Book1Id},(err,doc) =>
  {    
      if (!doc)
    {
      return console.log("Wrong book Id")
    }
    else
    {
      newStatus.BookId=doc.BookId;
      newStatus.BookName=doc.Title;
      newStatus.BookPhoto=doc.Cover;    
    }


});
}
else if ( type == "Rate")
{
  Book.findOne({BookId:Book1Id},(err,doc) =>
  {    
      if (!doc)
    {
      return console.log("Wrong book Id")
    }
    else{
      newStatus.BookId=doc.BookId;
      newStatus.BookName=doc.Title;
      newStatus.BookPhoto=doc.Cover;    
    }
  });
newStatus.NumberOfStars =NumberOfStars;

}
else // if comment
{
  
review.findOne({reviewId:ReviewId},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong review Id")
  }
  else
  {
    newStatus.ReviewId=doc.reviewId;
    newStatus.ReviewBody=doc.reviewBody;
    newStatus.ReviewDate=doc.reviewDate;
    newStatus.ReviewLikesCount= doc.likesCount;
  
  }


});

comment.findOne({CommentId:Comment1Id},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong comment Id")
  }
  else
  {
    newStatus.CommentId=doc.CommentId;
    newStatus.CommentBody=doc.Body;
    newStatus.CommentDate=doc.date;
    newStatus.CommentLikesCount= doc.likesCount;
  
  }
});

};

newStatus.save();
}

function CreatNotification( NotifiedUserId ,ReviewId , Comment1Id, Type, MakerId, NumberOfStars, Book1Id )
{
// basic infos
  var  newNotification = new Notification(
    {
      "UserId":NotifiedUserId,
      "NotificationType":Type, 
    });
    newNotification.NotificationId=newNotification._id;
//get the Maker Infos//
    User.findOne({UserId:MakerId},(err,doc )=>
    {
      if (!doc)
      {
        return console.log("Wrong Maker Id")
      }
      else{
        newNotification.MakerId=doc.UserId;
        newNotification.MakerPhoto=doc.Photo;
        newNotification.MakerName =doc.UserName;    
      }

    });
/////////////////////////////////////////
//////// three types/////////////////
//////////////////////////////////////////
/////review//////
if ( type == "ReviewLike")
{
review.findOne({reviewId:ReviewId},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong review Id")
  }
  else
  {
    newNotification.ReviewId=doc.reviewId;
    newNotification.ReviewBody=doc.reviewBody;
    newNotification.ReviewDate=doc.reviewDate;
    newNotification.ReviewLikesCount= doc.likesCount;
    newNotification.UserName=doc.userName;
    newNotification.UserPhoto=doc.photo;
    
  }

});

  Book.findOne({BookId:Book1Id},(err,doc) =>
  {    
      if (!doc)
    {
      return console.log("Wrong book Id")
    }
    else
    {
      newNotification.BookId=doc.BookId;
      newNotification.BookName=doc.Title;
      newNotification.BookPhoto=doc.Cover;    
    }


});
}
else if ( type == "CommentLike")
{
review.findOne({reviewId:ReviewId},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong review Id")
  }
  else
  {
    newNotification.ReviewId=doc.reviewId;
    newNotification.ReviewBody=doc.reviewBody;
    newNotification.ReviewDate=doc.reviewDate;
    newNotification.ReviewLikesCount= doc.likesCount;
  
  }


});

comment.findOne({CommentId:Comment1Id},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong comment Id")
  }
  else
  {
    newNotification.CommentId=doc.CommentId;
    newNotification.CommentBody=doc.Body;
    newNotification.CommentDate=doc.date;
    newNotification.CommentLikesCount= doc.likesCount;
    newNotification.UserName=doc.userName;
    newNotification.UserPhoto=doc.Photo;
 
  }
});
}
else if(Type= "Comment")
{
  review.findOne({reviewId:ReviewId},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong review Id")
  }
  else
  {
    newNotification.ReviewId=doc.reviewId;
    newNotification.ReviewBody=doc.reviewBody;
    newNotification.ReviewDate=doc.reviewDate;
    newNotification.ReviewLikesCount= doc.likesCount;
    newNotification.UserName=doc.userName;
    newNotification.UserPhoto=doc.photo;
 
  }


});

comment.findOne({CommentId:Comment1Id},(err,doc) =>
{    
    if (!doc)
  {
    return console.log("Wrong comment Id")
  }
  else
  {
    newNotification.CommentId=doc.CommentId;
    newNotification.CommentBody=doc.Body;
    newNotification.CommentDate=doc.date;
    newNotification.CommentLikesCount= doc.likesCount;
  
  }


}) 
};
newNotification.save();
}
 
module.exports= CreatNotification;
module.exports = CreatStatuses;
module.exports = router;
