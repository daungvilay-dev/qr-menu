<template>
  <div>
    <AppPageHeader
      eyebrow="System"
      title="Users"
      :description="
        isSuperAdmin
          ? 'Manage system users, assign roles, and control which accounts can own restaurants.'
          : 'Update your owner account information and password.'
      "
    >
      <a-button
        v-if="isSuperAdmin"
        type="primary"
        class="!bg-brand-500 !shadow-none hover:!bg-brand-600"
        @click="openCreateModal"
      >
        Add user
      </a-button>
    </AppPageHeader>

    <AppLoading v-if="systemStore.isLoading('users') || (isSuperAdmin && systemStore.isLoading('roles'))" />

    <div v-else class="rounded-[28px] border border-navy-500/50 bg-navy-700/50 p-4 shadow-card backdrop-blur">
      <a-table :data-source="visibleUsers" :pagination="false" row-key="id" :scroll="{ x: 1080 }">
        <a-table-column title="Username" data-index="username" key="username" />
        <a-table-column title="Nickname" key="nickname">
          <template #default="{ record }">
            {{ record.nickname || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Email" key="email">
          <template #default="{ record }">
            {{ record.email || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Phone" key="phone">
          <template #default="{ record }">
            {{ record.phone || '—' }}
          </template>
        </a-table-column>
        <a-table-column title="Roles" key="roles">
          <template #default="{ record }">
            <div class="flex flex-wrap gap-1">
              <a-tag v-for="role in record.roles || []" :key="role.id" color="blue">
                {{ role.name }}
              </a-tag>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="Status" key="status">
          <template #default="{ record }">
            <a-tag :color="record.status === 1 ? 'green' : 'default'">
              {{ record.status === 1 ? 'Enabled' : 'Disabled' }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="Actions" key="actions" align="right">
          <template #default="{ record }">
            <div class="flex justify-end gap-2">
              <a-button size="small" @click="openEditModal(record)">Edit</a-button>
              <a-button size="small" @click="openPasswordModal(record)">Password</a-button>
              <a-popconfirm v-if="isSuperAdmin" title="Delete this user?" @confirm="removeUser(record.id)">
                <a-button danger size="small">Delete</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </div>

    <a-modal
      :open="isModalOpen"
      :title="editingUser ? 'Edit user' : 'Create user'"
      width="760px"
      ok-text="Save"
      @cancel="closeModal"
      @ok="submitUser"
    >
      <a-form layout="vertical" :model="formState" class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <a-form-item label="Username" required>
          <a-input v-model:value="formState.username" :disabled="Boolean(editingUser) || !isSuperAdmin" />
        </a-form-item>
        <a-form-item label="Password" :required="!editingUser">
          <a-input-password v-model:value="formState.password" placeholder="Leave blank to keep current password" />
        </a-form-item>
        <a-form-item label="Nickname">
          <a-input v-model:value="formState.nickname" />
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item label="Phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="Status">
          <a-select v-model:value="formState.status" :disabled="!isSuperAdmin">
            <a-select-option :value="1">Enabled</a-select-option>
            <a-select-option :value="0">Disabled</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isSuperAdmin" label="Roles" required class="md:col-span-2">
          <a-select v-model:value="formState.roleIds" mode="multiple" placeholder="Select one or more roles">
            <a-select-option v-for="role in systemStore.roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :open="isPasswordModalOpen"
      title="Change user password"
      ok-text="Update"
      @cancel="closePasswordModal"
      @ok="submitPasswordChange"
    >
      <a-form layout="vertical" :model="passwordFormState">
        <a-form-item label="New password" required>
          <a-input-password v-model:value="passwordFormState.password" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { notification } from 'ant-design-vue'

import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoading from '@/components/ui/AppLoading.vue'
import { useAuthStore } from '@/store/auth'
import { useSystemStore } from '@/store/system'

const authStore = useAuthStore()
const systemStore = useSystemStore()
const isModalOpen = ref(false)
const isPasswordModalOpen = ref(false)
const editingUser = ref(null)
const passwordUser = ref(null)
const isSuperAdmin = computed(() => authStore.isSuperAdmin)
const visibleUsers = computed(() =>
  isSuperAdmin.value
    ? systemStore.users
    : systemStore.users.filter((user) => user.id === authStore.userId)
)

const formState = reactive({
  username: '',
  password: '',
  roleIds: [],
  nickname: '',
  email: '',
  phone: '',
  status: 1,
})

const passwordFormState = reactive({
  password: '',
})

function resetForm() {
  Object.assign(formState, {
    username: '',
    password: '',
    roleIds: [],
    nickname: '',
    email: '',
    phone: '',
    status: 1,
  })
}

function openCreateModal() {
  if (!isSuperAdmin.value) return
  editingUser.value = null
  resetForm()
  isModalOpen.value = true
}

function openEditModal(user) {
  if (!isSuperAdmin.value && user.id !== authStore.userId) return

  editingUser.value = user
  Object.assign(formState, {
    username: user.username || '',
    password: '',
    roleIds: (user.roles || []).map((role) => role.id),
    nickname: user.nickname || '',
    email: user.email || '',
    phone: user.phone || '',
    status: user.status ?? 1,
  })
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function submitUser() {
  try {
    const payload = {
      nickname: formState.nickname || undefined,
      email: formState.email || undefined,
      phone: formState.phone || undefined,
      ...(formState.password ? { password: formState.password } : null),
    }

    if (isSuperAdmin.value) {
      payload.username = formState.username
      payload.roleIds = [...formState.roleIds]
      payload.status = formState.status
    }

    await systemStore.saveUser(payload, editingUser.value?.id)
    notification.success({ message: 'User saved' })
    closeModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

function openPasswordModal(user) {
  if (!isSuperAdmin.value && user.id !== authStore.userId) return

  passwordUser.value = user
  passwordFormState.password = ''
  isPasswordModalOpen.value = true
}

function closePasswordModal() {
  isPasswordModalOpen.value = false
}

async function submitPasswordChange() {
  try {
    await systemStore.changeUserPassword(passwordUser.value.id, passwordFormState.password)
    notification.success({ message: 'Password updated' })
    closePasswordModal()
  } catch (error) {
    notification.error({ message: error.message })
  }
}

async function removeUser(id) {
  if (!isSuperAdmin.value) return

  try {
    await systemStore.deleteUser(id)
    notification.success({ message: 'User deleted' })
  } catch (error) {
    notification.error({ message: error.message })
  }
}

onMounted(async () => {
  const tasks = [systemStore.fetchUsers()]

  if (isSuperAdmin.value) {
    tasks.push(systemStore.fetchRoles())
  }

  await Promise.all(tasks)
})
</script>
