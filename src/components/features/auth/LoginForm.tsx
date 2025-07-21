import React from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Button, Input } from '../../ui';
import { useForm, validationRules } from '../../../hooks';
import { colors, spacing, textStyles } from '../../../styles';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword: () => void;
  onRegister: () => void;
  onSocialLogin: (provider: string) => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onRegister,
  onSocialLogin,
  loading = false,
}) => {
  const form = useForm<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  }, {
    email: validationRules.email,
    password: validationRules.password,
  });

  const handleSubmit = async () => {
    if (!form.validateForm()) {
      return;
    }

    try {
      await onSubmit(form.values);
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    onSocialLogin(provider);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PlanCraft</Text>
      <Input
        label="Email"
        placeholder="Enter your email"
        value={form.values.email}
        onChangeText={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
        error={form.touched.email ? form.errors.email : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        fullWidth
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        value={form.values.password}
        onChangeText={form.handleChange('password')}
        onBlur={form.handleBlur('password')}
        error={form.touched.password ? form.errors.password : undefined}
        secureTextEntry
        fullWidth
      />
      <View style={styles.rememberMeContainer}>
        <Button
          title="Remember me"
          variant="ghost"
          size="small"
          onPress={() => form.setValue('rememberMe', !form.values.rememberMe)}
          icon={form.values.rememberMe ? '✓' : undefined}
          iconPosition="left"
        />
      </View>
      <Button
        title="Login"
        onPress={handleSubmit}
        loading={loading}
        // disabled={!form.isValid || loading}
        fullWidth
        style={styles.loginButton}
      />
      <Button
        title="Forgot password?"
        variant="ghost"
        onPress={onForgotPassword}
        textStyle={styles.forgotPasswordButton}
      />
      <View style={styles.socialContainer}>
        <Text style={styles.socialTitle}>Or login with</Text>
        <View style={styles.socialButtons}>
          <Button
            title="Google"
            variant="outline"
            onPress={() => handleSocialLogin('google')}
            style={styles.socialButton}
          />
          <Button
            title="Facebook"
            variant="outline"
            onPress={() => handleSocialLogin('facebook')}
            style={styles.socialButton}
          />
        </View>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <Button
          title="Register"
          variant="ghost"
          onPress={onRegister}
          textStyle={styles.registerButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  rememberMeContainer: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  forgotPasswordButton: {
    ...textStyles.body2,
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  socialContainer: {
    marginBottom: spacing['2xl'],
  },
  socialTitle: {
    ...textStyles.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    ...textStyles.body2,
    color: colors.text.secondary,
  },
  registerButton: {
    ...textStyles.body2,
    color: colors.primary.main,
    textAlign: 'center',
  },
  helperText: {
    ...textStyles.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  errorText: {
    ...textStyles.caption,
    color: colors.error.main,
    fontWeight: 'bold',
  },
});

export default LoginForm; 