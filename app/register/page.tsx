import { Suspense } from 'react'
import { RegisterWizard } from './RegisterWizard'
import { RegisterRoleReader } from './RegisterRoleReader'

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterWizard role={null} />}>
      <RegisterRoleReader />
    </Suspense>
  )
}
