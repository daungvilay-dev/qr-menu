<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="glass-panel w-full max-w-md rounded-[32px] border border-white/10 p-8 shadow-card">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">Admin Access</p>
      <h1 class="mt-3 font-display text-4xl text-white">Welcome back</h1>
      <p class="mt-2 text-sm text-slate-400">
        Sign in to manage your categories, menu items, and QR codes.
      </p>

      <a-alert v-if="errorMessage" class="mt-6" type="error" :message="errorMessage" show-icon />

      <a-form
        layout="vertical"
        class="mt-6"
        :model="formState"
        @finish="submit"
      >
        <a-form-item label="Username or email" name="username" :rules="requiredRule">
          <a-input v-model:value="formState.username" size="large" placeholder="owner@example.com" />
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="requiredRule">
          <a-input-password v-model:value="formState.password" size="large" placeholder="••••••••" />
        </a-form-item>

        <a-button type="primary" html-type="submit" size="large" class="mt-2 w-full !bg-brand-500 !shadow-none hover:!bg-brand-600" :loading="authStore.loading">
          Sign in
        </a-button>
      </a-form>

      <p class="mt-6 text-center text-sm text-slate-400">
        Need a new restaurant account?
        <router-link class="font-semibold text-brand-400 hover:text-brand-300" :to="{ name: 'register' }">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notification } from 'ant-design-vue'

import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formState = reactive({
  username: '',
  password: '',
})

const errorMessage = ref('')
const requiredRule = [{ required: true, message: 'This field is required' }]

async function submit() {
  errorMessage.value = ''

  try {
    await authStore.login(formState)
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.length
        ? route.query.redirect
        : '/admin'

    await router.replace(redirect)
  } catch (error) {
    errorMessage.value = error.message
    notification.error({
      message: 'Login failed',
      description: error.message,
    })
  }
}
</script>
