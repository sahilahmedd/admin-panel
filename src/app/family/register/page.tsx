import Breadcrumbs from '@/components/Breadcrumbs'
import AddUserForm from '@/components/userRegister/Register'
// import RegisterForm from '@/components/userRegister/RegisterFrom'   
import React from 'react'

const page = () => {
  return (
    <div>
      <Breadcrumbs />
      {/* <RegisterForm /> */}
      <AddUserForm />
    </div>
  )
}

export default page
