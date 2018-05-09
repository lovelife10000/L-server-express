module.exports={
    res200False:function (res,msg) {
        return res.status(200).json({success: false, msg});
    },
    res200True:function (res,msg) {
        return res.status(200).json({success: true, msg});
    },
    res200FalseField:function (res,msg,field) {
        return res.status(200).json({success: false, msg,field});
    },
    res200TrueData:function (res,msg,data) {
        return res.status(200).json({success: true, msg,data});
    },
    res200True_id:function (res,msg,_id) {
        return res.status(200).json({success: true, msg,_id});
    }
}