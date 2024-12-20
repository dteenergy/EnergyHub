const getAuthToken = async(req, res, next) =>{
    const url = req.url;
    const ignorePath = process.env.IGNORE_PATH;
    const path = ignorePath.includes(url);
    
}