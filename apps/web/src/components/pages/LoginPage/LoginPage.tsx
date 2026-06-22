import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { LoginForm } from '../../organisms/LoginForm/LoginForm'
import { AuthTemplate } from '../../templates/AuthTemplate/AuthTemplate'
import { login } from '../../../api/auth'
import { extractApiError } from '../../../api/client'
import { setToken } from '../../../api/tokenStorage'
import { useSession } from '../../../api/SessionProvider'

export function LoginPage() {
  const navigate = useNavigate()
  const { refresh } = useSession()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: { email: string; password: string; rememberMe: boolean }) {
    setError('')
    setIsSubmitting(true)
    try {
      const { access_token } = await login({ email: data.email, password: data.password })
      setToken(access_token, data.rememberMe)
      await refresh()
      navigate('/feed')
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthTemplate
      banner={<AuthBanner imageSrc="/banner-login.png" imageAlt="Mulher desenvolvedora no computador" />}
      form={<LoginForm onSubmit={handleSubmit} error={error} isSubmitting={isSubmitting} />}
    />
  )
}
