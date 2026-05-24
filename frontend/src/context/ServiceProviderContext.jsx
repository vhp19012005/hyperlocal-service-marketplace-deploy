import React, { createContext, useState } from 'react'

export const ServiceProviderDataContext = createContext();

const ServiceProviderContext = ({children}) => {
    const [provider,setProvider] = useState({
      firstname: '',
      lastname: '',
      email: '',
      lat: '',
      long: ''
    });
  return (
    <div>
        <ServiceProviderDataContext.Provider value={{provider, setProvider}}>
            {children}
        </ServiceProviderDataContext.Provider>
    </div>
  )
}

export default ServiceProviderContext