<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="glass-panel w-full max-w-3xl rounded-[32px] border border-white/10 p-8 shadow-card">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">Restaurant Onboarding</p>
      <h1 class="mt-3 font-display text-4xl text-white">Create owner account</h1>
      <p class="mt-2 text-sm text-slate-400">
        The current backend creates the user first, then creates the restaurant profile tied to that user.
      </p>

      <a-alert v-if="errorMessage" class="mt-6" type="error" :message="errorMessage" show-icon />
      <a-alert v-if="successMessage" class="mt-6" type="success" :message="successMessage" show-icon />

      <a-form
        layout="vertical"
        class="mt-6 grid grid-cols-1 gap-x-4 md:grid-cols-2"
        :model="formState"
        @finish="submit"
      >
        <a-form-item label="Username" name="username" :rules="requiredRule">
          <a-input v-model:value="formState.username" size="large" />
        </a-form-item>

        <a-form-item label="Password" name="password" :rules="passwordRules">
          <a-input-password v-model:value="formState.password" size="large" />
        </a-form-item>

        <a-form-item label="Language" name="lang" :rules="requiredRule">
          <a-select v-model:value="formState.lang" size="large">
            <a-select-option value="EN">English</a-select-option>
            <a-select-option value="LA">Lao</a-select-option>
            <a-select-option value="TH">Thai</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Restaurant name" name="restaurantName" :rules="requiredRule">
          <a-input v-model:value="formState.restaurantName" size="large" />
        </a-form-item>

        <a-form-item label="Restaurant slug" name="restaurantSlug" :rules="requiredRule">
          <a-input v-model:value="formState.restaurantSlug" size="large" placeholder="my-restaurant" />
        </a-form-item>

        <a-form-item label="Contact email" name="contactEmail">
          <a-input v-model:value="formState.contactEmail" size="large" />
        </a-form-item>

        <a-form-item label="Phone" name="phone">
          <a-input v-model:value="formState.phone" size="large" />
        </a-form-item>

        <div class="md:col-span-2">
          <ImageUploadPreview
            input-id="restaurant-register-logo-upload"
            button-label="Choose restaurant logo"
            empty-title="No restaurant logo selected"
            empty-description="Upload a logo before creating the owner account."
            :preview-url="logoPreviewUrl"
            :file-name="logoFile?.name || ''"
            :has-preview="Boolean(logoPreviewUrl)"
            alt="Restaurant registration logo preview"
            @change="handleLogoChange"
            @clear="clearLogo"
          />
        </div>

        <div class="md:col-span-2">
          <a-button type="primary" html-type="submit" size="large" class="mt-2 !bg-brand-500 !shadow-none hover:!bg-brand-600" :loading="authStore.loading">
            Create account
          </a-button>
          <router-link class="ml-4 text-sm font-semibold text-brand-400 hover:text-brand-300" :to="{ name: 'login' }">
            Back to login
          </router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import ImageUploadPreview from '@/components/forms/ImageUploadPreview.vue'
import { createObjectPreviewUrl, revokeObjectPreviewUrl } from '@/utils/filePreview'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const formState = reactive({
  username: '',
  password: '',
  lang: 'EN',
  restaurantName: '',
  restaurantSlug: '',
  contactEmail: '',
  phone: '',
  logoUrl: '',
})
const logoFile = ref(null)
const localLogoPreviewUrl = ref('')
const logoPreviewUrl = computed(() => localLogoPreviewUrl.value)

const requiredRule = [{ required: true, message: 'This field is required' }]
const passwordRules = [
  { required: true, message: 'Password is required' },
  { min: 6, message: 'Password must be at least 6 characters' },
]

const errorMessage = ref('')
const successMessage = ref('')

function handleLogoChange(file) {
  revokeObjectPreviewUrl(localLogoPreviewUrl.value)
  logoFile.value = file
  localLogoPreviewUrl.value = file ? createObjectPreviewUrl(file) : ''
}

function clearLogo() {
  revokeObjectPreviewUrl(localLogoPreviewUrl.value)
  logoFile.value = null
  localLogoPreviewUrl.value = ''
}

async function submit() {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.registerRestaurantOwner({
      ...formState,
      file: logoFile.value || undefined,
    })
    successMessage.value = 'Account created. Sign in to continue.'
    setTimeout(() => router.push({ name: 'login' }), 1200)
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
