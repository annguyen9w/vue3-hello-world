<template>
  <n-layout class="users p-5">
    <n-layout-content>
      <n-card title="Create user" class="mb-6">
        <n-form
          ref="formRef"
          label-placement="left"
          label-width="auto"
          class="w-full"
          :model="formData"
          :rules="rules"
        >
          <n-form-item label="Email" path="email">
            <n-input v-model:value="formData.email" placeholder="Email" />
          </n-form-item>
          <n-form-item label="Password" path="password">
            <n-input v-model:value="formData.password" type="password" placeholder="Password" />
          </n-form-item>
          <n-form-item label="First Name" path="firstName">
            <n-input v-model:value="formData.firstName" placeholder="First Name" />
          </n-form-item>
          <n-form-item label="Last Name" path="lastName">
            <n-input v-model:value="formData.lastName" placeholder="Last Name" />
          </n-form-item>

          <n-layout-footer class="bg-white d-flex flex-end !my-0">
            <n-space justify="end">
              <n-button type="default" @click.prevent="onCancel">
                Cancel
              </n-button>
              <n-button type="primary" @click.prevent="onSubmit">
                Create
              </n-button>
            </n-space>
          </n-layout-footer>
        </n-form>
      </n-card>
      <n-card title="List users">
        <n-data-table
          :columns="columns"
          :data="users"
          :pagination="false"
          :bordered="false"
        />
      </n-card>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NCard, NDataTable, NLayout, NLayoutContent, NLayoutFooter, NSpace, NForm, NFormItem, NInput } from 'naive-ui'
import axios from 'axios'
import type { FormRules, FormItemRule } from 'naive-ui'
import type { ValidateError } from 'async-validator'

const columns = ref([
  {
    title: "No",
    key: "userNumber"
  },
  {
    title: "Email",
    key: "email"
  },
  {
    title: "Full Name",
    key: "fullName"
  }
])

const users = ref([])

const formInitValue = {
  email: '',
  password: '',
  firstName: '',
  lastName: ''
}
const rules: FormRules = {
  email: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (value && !String(value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return new Error('Invalid email format')
      }
      if (!value) {
        return new Error('Email is required')
      }
      return true
    }
  },
  password: { required: true, message: 'Password is required' },
  firstName: { required: true, message: 'First Name is required' },
  lastName: { required: true, message: 'Last Name is required' }
}
const formRef = ref<typeof NForm | null>(null)
const formData = ref(JSON.parse(JSON.stringify({ formInitValue })).formInitValue)

onMounted(() => {
  getUsers()
})

async function getUsers() {
  const { data } = await axios.get('/api/v1/users')
  users.value = data
}

function onCancel() {
  formData.value = JSON.parse(JSON.stringify({ formInitValue })).formInitValue
  formRef.value?.restoreValidation()
}

async function onSubmit() {
  const errors = await formRef.value?.validate((errors: ValidateError) => errors)
  if (!errors) {
    await axios.post('/api/v1/users', formData.value)
    getUsers()
    onCancel()
  }
}

</script>

<style>
@media (min-width: 1024px) {
  .users {
    min-height: 100vh;
  }
}
</style>
