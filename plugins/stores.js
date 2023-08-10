import { useUserStore } from '../stores/user'
import { useGeneralStore } from '../stores/general'
import { useProfileStore } from '../stores/profile'

export default defineNuxtPlugin((NuxtApp) => {
  return {
    provide: {
      userStore: useUserStore(),
      profileStore: useProfileStore(),
      generalStore: useGeneralStore(),
    },
  }
})
