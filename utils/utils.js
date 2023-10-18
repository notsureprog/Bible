export default {
    authorize: () => {
        return 'token'
    },
    isAuthorized: secret => secret === 'wuzard'
}