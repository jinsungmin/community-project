import axios from 'axios'
import {logger} from '../index'

async function getMe(accessToken: string) {
    try {
        const {data} = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        logger.info(['카카오 유저정보 = ', JSON.stringify(data)])
        return data
    } catch (e) {
        throw new Error(e)
    }
}

export {getMe}
