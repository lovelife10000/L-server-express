const validator = require('validator')


module.exports = {

  validateWords(str) {
    let pattern = new RegExp('[<>#$%^*+*]')
    let newParams = ''
    for (let i = 0; i < str.length; i++) {
      newParams += str.substr(i, 1).replace(pattern, '')
    }
    return newParams
  },
  // 校验用户名
  checkUserName(str) {
    return /^[a-zA-Z][a-zA-Z0-9_]{4,11}$/.test(str)
  },
  // 校验中文GBK
  checkName(str, min = 2, max = 6) {
    return str && validator.isLength(str, min, max) && /[\u4e00-\u9fa5]/.test(str)
  },
  // 校验密码
  checkPwd(str, min = 6, max = 32) {
    return str && validator.isLength(str, 5, max) && /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/.test(str)
  },
  // 校验邮箱
  checkEmail(str) {
    return str && validator.isEmail(str)
  },
  // 校验手机号
  checkPhoneNum(str) {
    return str && validator.isMobilePhone(str.toString(), 'zh-CN')
  },
  // 校验QQ号
  checkQqNum(str) {
    return RegExp(/^[1-9][0-9]{4,9}$/).test(str)
  },

  check_Id(str) {
    return str && validator.isMongoId(str)
  },

  checkCurrentPage(str) {
    return RegExp(/^([1-9][0-9]{0,2}|1000)$/).test(str)
  },
  checkPageSize(str) {
    return RegExp(/^(10|20|30|40)$/).test(str)
  },

  checkCategoryName(str) {
    return RegExp(/^[\w\d\u4e00-\u9fa5]{1,32}$/).test(str)
  },

  checkCategorySlug(str) {
    return RegExp(/^[a-zA-Z]\w{1,10}$/).test(str)
  },
  checkCategoryOrder(str) {
    return RegExp(/^([1-9]\d{0,2}|1000)$/).test(str)
  },
  checkCategoryParentId(str) {
    return (str && validator.isMongoId(str)) || str==='firstCateNone'
  },

  checkUserGroupName(str) {
    return RegExp(/^[\w\u4e00-\u9fa5]{1,20}$/).test(str)
  },
  checkUserGroupParentId(str) {
    return str && validator.isMongoId(str) || str==='0'
  },
}