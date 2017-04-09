import {push} from 'react-router-redux'

export const nonStandardActions = {
  navigateToSearch: (payload: string) => {
    return push({
      pathname: '/',
      search: payload,
    })
  },
}
