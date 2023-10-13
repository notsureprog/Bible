import { NavigationActions } from 'react-navigation'

let navigation;

export const setNavigator = (ref) => {
    navigation = ref
}

// idk if it will work now the way i have set up. however, it couls come in handy for displaying only the login and register for the non logged in person
export const navigation = (routeName, params) => {
    navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params
        })
    )
}