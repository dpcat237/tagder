import axios from 'axios'
import keys from '../../constants/keys.json'

function getDomain() {
  return keys.api.domain + keys.api.userID + "/"
}

class Link {
  constructor() {
    this.setDefaults()
  }

  setDefaults() {
    this.errorMessage = ""
    this.isLink = false
    this.loadedLink = {}
    this.savedLink = false
    this.updatedLink = false
  }
}

export default {
  actions: {
    getLink({ commit }, url) {
      commit('updateData', { key: 'isLink', value: false })

      const options = {
        headers: {
          "Content-Type": 'application/json',
          api_key: keys.api.apiKey,
        },
      }

      axios
          .get(getDomain() + 'links?url='+encodeURI(url), options)
          .then(function(response) {
            if (response.data.length > 0) {
              commit('updateData', { key: 'loadedLink', value: response.data[0] })
              commit('updateData', { key: 'isLink', value: true })
            }
          })
          .catch(function(error) {
            console.log('Error fetching tags by prefix' + error)
          })
    },
    saveLnk({ commit }, link) {
      commit('updateData', { key: 'savedLink', value: false })
      commit('updateData', { key: 'errorMessage', value: '' })

      const options = {
        headers: {
          "Content-Type": 'application/json',
          api_key: keys.api.apiKey,
        },
      }

      axios.post(getDomain() + 'links', link, options).then(
          response => {
            if (response.status === 201) {
              commit('updateData', { key: 'savedLink', value: true })
            }
          },
          error => {
            commit('updateData', { key: 'errorMessage', value: 'Error saving link' })
            commit('updateData', { key: 'savedLink', value: true })
          }
      )
    },
    updateLnk({ commit }, link) {
      commit('updateData', { key: 'updatedLink', value: false })
      commit('updateData', { key: 'errorMessage', value: '' })

      const options = {
        headers: {
          "Content-Type": 'application/json',
          api_key: keys.api.apiKey,
        },
      }

      axios.put(getDomain() + 'links/'+link.id, link, options).then(
          response => {
            if (response.status === 200) {
              commit('updateData', { key: 'updatedLink', value: true })
            }
          },
          error => {
            commit('updateData', { key: 'errorMessage', value: 'Error updating link' })
            commit('updateData', { key: 'updatedLink', value: true })
          }
      )
    },
  },
  mutations: {
    updateData(state, data) {
      state[data.key] = data.value
    },
  },
  state: new Link(),
  getters: {
    link(state) {
      return state
    },
  },
}
