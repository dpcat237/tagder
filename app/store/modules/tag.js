import axios from 'axios'
import keys from '../../constants/keys.json'

const tagsLimit = 4

function getDomain() {
  return keys.api.domain + keys.api.userID + "/"
}

class Tag {
  constructor() {
    this.setDefaults()
  }

  setDefaults() {
    this.errorMessage = ""
    this.savedTag = false
    this.tags = []
  }
}

export default {
  actions: {
    filterTags({ commit }, prefix) {
      const options = {
        headers: {
          Accept: 'application/json',
          api_key: keys.api.apiKey,
        },
      }

      axios
          .get(getDomain() + 'tags?limit=' +tagsLimit+ '&prefix='+prefix, options)
          .then(function(response) {
            commit('updateData', { key: 'tags', value: response.data })
          })
          .catch(function(error) {
            console.log('Error fetching tags by prefix' + error)
          })
    },
  },
  mutations: {
    updateData(state, data) {
      state[data.key] = data.value
    },
  },
  state: new Tag(),
  getters: {
    tag(state) {
      return state
    },
  },
}
