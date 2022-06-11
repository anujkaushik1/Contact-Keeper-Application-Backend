exports.register = function(req, res){
    res.status(200).json({
        success : true,
        msg : 'User registered successfully'
    })
}