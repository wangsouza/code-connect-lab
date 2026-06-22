import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { SignupForm } from '../../organisms/SignupForm/SignupForm'
import { AuthTemplate } from '../../templates/AuthTemplate/AuthTemplate'
import { login } from '../../../api/auth'
import { createUser } from '../../../api/users'
import { extractApiError } from '../../../api/client'
import { setToken } from '../../../api/tokenStorage'
import { useSession } from '../../../api/SessionProvider'

export function SignupPage() {
  const navigate = useNavigate()
  const { refresh } = useSession()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: {
    name: string
    email: string
    password: string
    rememberMe: boolean
  }) {
    setError('')
    setIsSubmitting(true)
    try {
      await createUser({ name: data.name, email: data.email, password: data.password })
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
      banner={<AuthBanner imageSrc="/banner-cadastro.png" imageAlt="Mulher desenvolvedora com óculos futuristas" />}
      form={<SignupForm onSubmit={handleSubmit} error={error} isSubmitting={isSubmitting} />}
    />
  )
}
