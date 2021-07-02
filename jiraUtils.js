const JiraClient = require("jira-connector")

function initJiraClient(config) {
    return new JiraClient({
        host: config.jiraHost,
        basic_auth: {
            email: config.jiraUserEmail,
            api_token: config.jiraUserApiToken
          }
      })
}

function updateFixVersion(fixVersion, issueKey, jiraClient) {
    jiraClient.issue.getIssue(
        {
          issueKey: issueKey
        },
        function(error, issue) {
          var alreadyAssignedVersion = issue.fields.fixVersions

          // If the fix version is already assigned to this issue, stop instructions
          if (alreadyAssignedVersion.map(v => v.name).includes(fixVersion)) {
              console.log('Next release fix version is already assigned')
              return
          }

          jiraClient.issue.editIssue(
            {
              issueKey: issueKey,
              issue: {
                update: {
                  fixVersions:  [ {"add" : {"name" : fixVersion }} ]
                }
              }
            },
            function(error, issue) {
                if (issue)
                    console.log(issue)

                if (error)
                    console.error(error)
            }
          );
          
        }
    );
}

function updateIssue(issueKey, config) {
    var jiraClient = initJiraClient(config)

    // If destination branch is 'develop' so the issue's fix version will be the next release's version
    if (config.bitbucketBranch == 'develop') {
        jiraClient.project.getVersions(
            {
                projectIdOrKey: config.jiraProjectId
            },
            function(error, versions) {
                var nextFixVersion = versions.filter(r => new Date(r.releaseDate) > new Date())[0].name
        
                updateFixVersion(nextFixVersion, issueKey, jiraClient)
            }
        )
    }

    // If destination branch is a release, so it is either a backport or hotfix
    // So the fix version of this issue is that existing release's version
    if (config.bitbucketBranch.indexOf('release/') > -1) {
        var relaseVersion = config.bitbucketBranch.split('release/')[1]
        updateFixVersion(config.jiraFixVersionPrefix + '_' + relaseVersion, issueKey, jiraClient)
    }
}

function matchJiraTicket (str, regex) {
    var matchJiraTicketKey = str.match(regex)

    if (!matchJiraTicketKey || !matchJiraTicketKey.length) {
        return null
    }

    return matchJiraTicketKey[0]
}

exports.updateIssue = updateIssue
exports.matchJiraTicket = matchJiraTicket
