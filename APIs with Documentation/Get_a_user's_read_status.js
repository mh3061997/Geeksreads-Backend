/** 
 * @api {get} /read_statuses/id Get a user's read status
 * @apiName GetRead_Statuses
 * @apiGroup Status
 * @apiError {404} NOTFOUND Status could not be found
 * @apiParam {Credentials} apiKey Api key from app console.
 * @apiParam {Number} Statusid Read status id.
 * 
 * @apiSuccess  status
 * 
 * @apiSuccessExample 
 *      HTTP/1.1 200 0k
 * { 
 *      "status": "Read"
 * }
 */
var currentuserstatus={
    status:'Read'
};
function GetReadStatus()
{
    return{code:200 , data:currentuserstatus};
}
