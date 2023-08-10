<template>
	<NuxtPage />

	<AuthOverlay v-if="isLoginOpen" />
	<EditProfileOverlay v-if="isEditProfileOpen" />
</template>

<script setup>
	import { storeToRefs } from 'pinia'
	const { $generalStore, $userStore } = useNuxtApp()
	const { isLoginOpen, isEditProfileOpen } = storeToRefs($generalStore)

	//we intercep if the session has been expired it depends from the backend
	//is session get the user, if not, go to login normality
	onMounted(async () => {
		$generalStore.bodySwitch(false)
		isLoginOpen.value = false
		isEditProfileOpen.value = false
		try {
			await $generalStore.hasSessionExpired()
			await $generalStore.getRandomUsers('suggested')
			await $generalStore.getRandomUsers('following')

			if ($userStore.id) {
				$userStore.getUser()
			}
		} catch (error) {
			console.log(error)
		}
	})

	//with this two watches prevent the scrolll when open menu or login menu has ven open
	watch(
		() => isLoginOpen.value,
		(val) => {
			$generalStore.bodySwitch(val)
		}
	)
	watch(
		() => isEditProfileOpen.value,
		(val) => {
			$generalStore.bodySwitch(val)
		}
	)
</script>
