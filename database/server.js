import axios from 'axios'

const API_URL = '/api/url'
const options = {
    method: 'POST',
    url: API_URL
}
const register = async () => {
    const response = await axios(options)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

export default server