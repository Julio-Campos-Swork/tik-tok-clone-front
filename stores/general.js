import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from '../plugins/axios'

const $axios = axios().provide.axios
export const useGeneralStore = defineStore('general', {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: '/',
    posts: null,
    suggested: [],
    following: [],
  }),
  actions: {
    bodySwitch(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
        return
      }
      document.body.style.overflow = 'visible'
    },

    allLowerCaseNoCaps(string) {
      return string.split(' ').join('').toLowerCase()
    },
    setBackUrl(url) {
      this.isBackUrl = url
    },

    // update image panel for user (user is reactive dont forget)
    updateSideMenuImage(array, user) {
      for (let i = 0; i < array.length; i++) {
        const res = array[i]
        if (res.id == user.id) {
          res.image = user.image
        }
      }
    },

    async getRandomUsers(type) {
      const res = await $axios.get('/api/get-random-users')

      if (type === 'following') {
        this.following = res.data.following
      }
      if (type === 'suggested') {
        this.suggested = res.data.suggested
      }
    },
    async getAllUsersAndPosts() {
      let res = await $axios.get('/api/home')
      this.posts = res.data
    },
    async getPostById(id) {
      let res = await $axios.get(`/api/posts/${id}`)

      this.$state.selectedPost = res.data.post[0]
      this.$state.ids = res.data.ids
    },
    async hasSessionExpired() {
      await $axios.interceptors.response.use(
        (response) => {
          return response
        },
        (error) => {
          switch (error.response.status) {
            case 401: // Not logged in
            case 419: // session expried
            case 503: //down for maintenance
              // bounce the user to the login screen with a redireck back
              useUserStore().resetUser()
              window.location.href = '/'
              break
            case 500:
              alert('Oops, something went wrong! The team has been notified')
              break
            default:
              return Promise.reject(error)
          }
        }
      )
    },
  },
  persist: true,
})
