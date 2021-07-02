const { getConfig } = require('./configUtils')
const { getCommitDetails } = require('./bitbucketUtils')
const { updateIssue, matchJiraTicket } = require('./jiraUtils')

/*
    Command line: (replace with correct credentials)
    npm start JIRA_HOST=${JIRA_HOST} JIRA_USER_EMAIL=${JIRA_USER_EMAIL} JIRA_USER_API_TOKEN=${JIRA_USER_API_TOKEN} JIRA_PROJECT_ID=${JIRA_PROJECT_ID} JIRA_FIX_VERSION_PREFIX=${JIRA_FIX_VERSION_PREFIX} JIRA_ISSUE_KEY_REGEX=${JIRA_ISSUE_KEY_REGEX} BIBUCKET_AUTH_USER=${BIBUCKET_AUTH_USER} BITBUCKET_AUTH_PWD=${BITBUCKET_AUTH_PWD} BITBUCKET_BRANCH=${BITBUCKET_BRANCH} BITBUCKET_COMMIT=${BITBUCKET_COMMIT}
*/
function main (config) {
    getCommitDetails(config)
    .then(commit => {
        if (!commit) {
            console.error('No commit found for this build')
            return
        }

        // Search if in the commit message we can found the JIRA ticket number
        var jiraIssueKey = matchJiraTicket(commit.message, config.jiraIssueKeyRegex)

        if (!jiraIssueKey) {
            console.error('No Jira issue key found on merge commit message (commit hash : ' + commit.hash + ')')
            return
        }
        
        // Update issue only if we have found the associated JIRA ticket
        updateIssue(jiraIssueKey, config)
    })
}

main(getConfig())
