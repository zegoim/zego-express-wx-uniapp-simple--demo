export const getLoginToken = (appID, userID) => {
    let { tokenURL, cgi_token, tokenTestURL } = getApp().globalData;
    return new Promise((resolve, reject) => {
        if(cgi_token) {
            uni.request({
                url: tokenTestURL,
                data: {
                    app_id: appID,
                    id_name: userID,
                    cgi_token
                },
                header: {
                    'content-type': 'text/plain'
                },
                success(res) {
                    if(res.statusCode === 200) {
                        resolve(res.data)
                    } else {
                        reject(res)
                    }
                }, 
                fail(err) {
                    reject(err)
                }
            })
        }else {
            uni.request({
                url: tokenURL,// 该接口由开发者后台自行实现，开发者的 Token 从各自后台获取
                data: {
                    app_id: appID,
                    id_name: userID
                },
                header: {
                    'content-type': 'text/plain'
                },
                success(res) {
                    if(res.statusCode === 200 ) resolve(res.data)
                    else reject(res)
                },
                fail(err) {
                    reject(err)
                }
            })
        }
    })
}