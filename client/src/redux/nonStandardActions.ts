import {push, RouterAction} from 'react-router-redux'

export const nonStandardActions = {
  navigateToSearch: (payload: string): RouterAction => {
    return push({
      pathname: '/',
      query: {
        searchTerm: payload,
      },
    })
  },
}
