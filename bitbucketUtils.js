const axios = require('axios')
const qs = require('querystring')

function getAccessToken (user, password) {
    try {
        return axios({
            method: 'post',
            url: 'https://bitbucket.org/site/oauth2/access_token',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: user,
                password: password
            },
            data : qs.stringify({
                'grant_type': 'client_credentials' 
            })
        })
        .then(response => {
            return response.data.access_token
        })
        .catch(console.log)
    }
    catch (error) {
        return error
    }
}

function findCommit (access_token, commitHash) {
    try {
        return axios({
            method: 'get',
            url: 'https://api.bitbucket.org/2.0/repositories/loccitane/ecom-core/commit/' + commitHash,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + access_token
            },
        })
        .then(response => {
            return response.data
        })
    }
    catch (error) {
        return error
    }
}

function getCommitDetails (config) {
    return getAccessToken(config.bitbucketAuthUser, config.bitbucketAuthPwd)
            .then(access_token => {
                return findCommit(access_token, config.bitbucketTriggeredCommitHash)
            })
}

exports.getCommitDetails = getCommitDetails
