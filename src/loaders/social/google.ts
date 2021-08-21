import axios from 'axios'
import config from 'config'
import {google} from 'googleapis'
import {OAuth2Client} from 'google-auth-library'

const googleInfo: any = config.get('google')
const baseUrl = 'https://people.googleapis.com'

function urlRequest(options) {
    return axios({
        method: options.method || 'get',
        url: baseUrl + options.path,
        params: options.params || {},
        data: options.data || {},
        timeout: 10000
    })
}

//
async function getUrl(): Promise<string> {
    const scopes = [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ]
    const oauth2Client = new google.auth.OAuth2(
        googleInfo.googleClientId,
        googleInfo.googleClientSecret,
        googleInfo.googleRedirect
)
    return oauth2Client.generateAuthUrl({access_type: 'offline', scope: scopes})
}

//
async function getMe(code: string): Promise<{ id: string, email: string, name: string }> {
    try {
        //const clientId = socialConfig.info.googleClientIdForAndroid
        const clientId = googleInfo.googleClientId
        const client = new OAuth2Client(clientId)
        const ticket = await client.verifyIdToken({
            idToken: code,
            audience: clientId
        })
        const payload = ticket.getPayload()
        const id = payload['sub']
        return {id, email: payload.email, name: payload.name}
    } catch (e) {
        throw new Error(e)
    }
}

export {getMe, getUrl}
