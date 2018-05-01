module.exports = {
    RelationList: function (data, idName, parentIdName, parentIdValue) {


        let top = data.filter((item) => (item[parentIdName] === parentIdValue))

        function get(arr) {

            for (i of arr) {

                const child = data.filter((item) => (item[parentIdName] === i[idName]))

                if (child.length > 0) {
                    i.children = child;


                    get(i.children)
                }
            }

            return arr
        }


        return get(top)


    },

    //数组里面的取部分键值
    mapArrToGetKeys: function (array, keys) {

        let arr = []
        array.map(function (item) {
            let obj = {};

            for (x of keys) {


                obj[x] = item[x]


            }

            arr.push(obj)
        })

        return arr
    },

    //数组里面的对象增加键值
    addKeyForArr: function (arr) {


        function we(arr) {

            for (i of arr) {

                i.key = i.id;
                if (i.children) {
                    we(i.children)
                }
            }
        }
        we(arr)
        return arr

    }
}