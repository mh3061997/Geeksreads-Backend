//UNFollow User
 /**
 * 
 * @api {POST}  /api/Users/unFollow Unfollow a user
 * @apiName Unfollow user
 * @apiGroup User
 * @apiError {404} id-not-found The<code>userId_tobefollowed</code> was not found.
 * @apiSuccess {200} UNFollow Successful 
 * @apiParam  {String} myuserId GoodReads User ID
 * @apiParam  {String} userId_tobefollowed GoodReads User ID
  
 * @apiSuccessExample {JSON}
 * HTTP/1.1 200 OK
   {
      "success": true,
      "Message":"Successfully done"
   }
 *  @apiError id-not-found The<code>userId</code> was not found.
 *  @apiErrorExample {JSON}
 *  HTTP/1.1 404 Not Found
 * {
 * "success": false,
 * "Message":"User Id not  found !"
 * }
 *  
 * 
 */

  //UNFollow User
  router.post('/unFollow', async (req, res) => { //sends post request to /unFollow End point through the router
    /* console.log(req.body.userId_tobefollowed);
    console.log(req.userId_tobefollowed);
    console.log(req.params.userId_tobefollowed);
    console.log(req.query.userId_tobefollowed);  //ONLY WORKINGGGGGGGGGGGG
    console.log("my"+req.query.myuserid);*/
      mongoose.connection.collection("Users").updateOne( // accesses basic mongodb driver to update one document of Users Collection
    
        {
            UserId :  req.query.userId_tobefollowed //access document of user i want to unfollow
        },
        {$pull: { // pull from end of array of the users I follow
          FollowersUserId:req.query.myuserid
        }}
        ,function (err,doc) { // error handling and checking for returned mongo doc after query
    
          if ( doc.matchedCount==0 || err)   //matched count checks for number of affected documents by query 
          { 
            
            res.status(404).json({  // sends a json with 404 code
           success: false ,  // Follow Failed
            "Message":"User Id not  found !"});
          }
        else
        {
        //console.log(doc);
        res.status(200).json({ //sends a json with 200 code
          success: true , //Follow Done 
           "Message":"Sucessfully done"});
        }
      });
      mongoose.connection.collection("Users").updateOne(
          {
              UserId :req.query.myuserid//access document of currently logged In user 
          },
          {$pull: { // pull from end of array of the users I follow
            FollowingUserId: req.query.userId_tobefollowed
          }});
          
         
          });  
 