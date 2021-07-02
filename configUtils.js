require('dotenv').config()

function argumentValueFor(argumentName, isLocal) {
    if (isLocal) {
        return process.env[argumentName]
    }
    
    const arg = process.argv.find(arg => arg.includes(argumentName))

    if (arg)
        return arg.split('=')[1]

    return false
}

function parseConfig (isLocal) {
    return {
        jiraHost: argumentValueFor('JIRA_HOST', isLocal),
        jiraUserEmail: argumentValueFor('JIRA_USER_EMAIL', isLocal),
        jiraUserApiToken: argumentValueFor('JIRA_USER_API_TOKEN', isLocal),
        jiraProjectId: argumentValueFor('JIRA_PROJECT_ID', isLocal),
        jiraFixVersionPrefix: argumentValueFor('JIRA_FIX_VERSION_PREFIX', isLocal),
        jiraIssueKeyRegex: argumentValueFor('JIRA_ISSUE_KEY_REGEX', isLocal),
        bitbucketAuthUser: argumentValueFor('BIBUCKET_AUTH_USER', isLocal),
        bitbucketAuthPwd: argumentValueFor('BITBUCKET_AUTH_PWD', isLocal),
        bitbucketBranch: argumentValueFor('BITBUCKET_BRANCH', isLocal),
        bitbucketTriggeredCommitHash: argumentValueFor('BITBUCKET_COMMIT', isLocal),
    }
}

function getConfig () {
    const isLocal = process.env.NODE_ENV == 'local'

    return parseConfig(isLocal)
}

exports.getConfig = getConfig
