import * as core from '@actions/core'
import axios, {isAxiosError} from 'axios'

async function validateSubscription(): Promise<void> {
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`

  try {
    await axios.get(API_URL, {timeout: 3000})
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      /* eslint-disable i18n-text/no-en */
      core.error(
        'Subscription is not valid. Reach out to support@stepsecurity.io'
      )
      /* eslint-enable i18n-text/no-en */

      process.exit(1)
    } else {
      core.info('Timeout or API not reachable. Continuing to next step.') // eslint-disable-line i18n-text/no-en
    }
  }
}

async function run(): Promise<void> {
  await validateSubscription()

  try {
    const cond: string = core.getInput('cond', {required: true})
    const ifTrue: string = core.getInput('if_true')
    const ifFalse: string = core.getInput('if_false')
    core.setOutput('value', cond === 'true' ? ifTrue : ifFalse)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(JSON.stringify(error))
    }
  }
}

run()
