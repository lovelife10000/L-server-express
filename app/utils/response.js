module.exports={
    res200False:function (res,msg) {
        return res.status(200).json({success: false, msg});
    },
    res200True:function (res,msg) {
        return res.status(200).json({success: true, msg});
    },
    res200FalseField:function (res,msg,field) {
        return res.status(200).json({success: false, msg,field});
    }
}