const getAuthToken = async(req, res, next) =>{
    const url = req.url;
    const ignorePath = process.env.IGNORE_PATH;
    const path = ignorePath.includes(url);
    
    if((path !== '/api/getServiceAccessToken') && (!req.headers['user-agent']).startsWith("Postman")) next();
    else {
        return {"accessToken":"34ae189a-ae09-4563-815e-5aea94dd0cb5"}
    }
}

module.exports = getAuthToken;