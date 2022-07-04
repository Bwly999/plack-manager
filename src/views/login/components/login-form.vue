<template>
  <div p4 bg-gray="50" rounded>
    <div v-show="!isRegister" class="login-form-wrapper">
      <div class="login-form-title">{{ $t('login.form.title') }}</div>
      <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
      <div class="login-form-error-msg">{{ errorMessage }}</div>
      <a-form
        ref="loginForm"
        :model="userInfo"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
      >
        <a-form-item
          field="userName"
          :rules="[
            { required: true, message: $t('login.form.userName.errMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="userInfo.userName"
            :placeholder="$t('login.form.userName.placeholder')"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
          ]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="userInfo.password"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-space :size="16" direction="vertical">
          <div class="login-form-password-actions">
            <a-checkbox
              checked="rememberPassword"
              :model-value="loginConfig.rememberPassword"
              @change="setRememberPassword"
            >
              {{ $t('login.form.rememberPassword') }}
            </a-checkbox>
            <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
          </div>
          <a-button type="primary" html-type="submit" long :loading="loading">
            {{ $t('login.form.login') }}
          </a-button>
          <a-button
            type="text"
            long
            class="login-form-register-btn"
            @click="isRegister = true"
          >
            {{ $t('login.form.register') }}
          </a-button>
        </a-space>
      </a-form>
    </div>

    <div v-show="isRegister" class="login-form-wrapper">
      <div class="login-form-title">注册xxxxxx</div>
      <div class="login-form-sub-title">注册xxxxxx</div>
      <div class="login-form-error-msg">{{ errorMessage }}</div>
      <a-form
        ref="registerForm"
        :model="registerUserInfo"
        class="login-form"
        layout="vertical"
        @submit="handleRegisterSubmit"
      >
        <a-form-item
          field="userName"
          :rules="[{ required: true, message: '用户名不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="registerUserInfo.userName"
            :placeholder="$t('login.form.userName.placeholder')"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[{ required: true, message: '密码不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input-password
            v-model="registerUserInfo.password"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          field="phone"
          :rules="[{ required: true, message: '手机号不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="registerUserInfo.phone"
            placeholder="请填写手机号"
            allow-clear
          >
            <template #prefix>
              <icon-phone />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="shopName"
          :rules="[{ required: true, message: '店铺名不能为空' }]"
          :validate-trigger="['change', 'blur']"
          hide-label
        >
          <a-input
            v-model="registerUserInfo.shopName"
            placeholder="请填写店铺名"
            allow-clear
          >
            <template #prefix>
              <icon-home />
            </template>
          </a-input>
        </a-form-item>
        <a-space :size="16" direction="vertical">
          <a-button type="primary" html-type="submit" long :loading="loading">
            注册
          </a-button>
          <a-button
            type="text"
            long
            class="login-form-register-btn"
            @click="isRegister = false"
          >
            返回登录
          </a-button>
        </a-space>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { type LoginData, type RegisterData, register } from '@/api/user';
  import { Md5 } from 'ts-md5/dist/md5';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const isRegister = ref(false);

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    userName: 'admin', // 演示默认值
    password: 'admin', // demo default value
  });
  const userInfo = reactive({
    userName: loginConfig.value.userName,
    password: loginConfig.value.password,
  });

  const registerUserInfo = reactive({
    userName: '',
    password: '',
    phone: '',
    shopName: '',
  });

  const encrypt = (values: LoginData) => {
    values.password = Md5.hashStr(values.password).toString();
  };

  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: LoginData;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        const user = {} as RegisterData;
        Object.assign(user, values);
        user.userName = values.userName;
        encrypt(user);
        await userStore.login(user);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { userName, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.userName = rememberPassword ? userName : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as any)?.response?.data?.errmsg;
        Message.error('登录失败');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleRegisterSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: RegisterData;
  }) => {
    if (!errors) {
      setLoading(true);
      try {
        const user = {} as RegisterData;
        Object.assign(user, values);
        encrypt(user);
        await register(user);
        Message.success('注册成功');
        errorMessage.value = '';
      } catch (err) {
        errorMessage.value = (err as any)?.response?.data?.errmsg;
      } finally {
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
