import api from '../../../api/axiosInstance'

export const getFamilies = async (params) => {
  const response = await api.get('/admin/family/list', {
    params,
  })

  return response.data
}

export const blockUnblockFamily = async (payload) => {
  const response = await api.post(
    '/admin/family/blockUnblock',
    payload
  )

  return response.data
}

export const getFamilyDetails = async (id) => {
  const response = await api.get(
    `/admin/family/details/${id}`
  )

  return response.data
}

export const addFamilyMember = async (payload) => {
    const response = await api.post( '/admin/family/addProfile', payload, 
        { headers: { 'Content-Type': 'multipart/form-data', }, } ) 
        return response.data 
}
export const updateFamilyMember = async ({
  id,
  payload,
}) => {
  const response = await api.put(
    `/admin/family/updateProfile/${id}`,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}

export const createFamily = async (payload) => { 
    const response = await api.post( '/admin/family/create', payload ) 
    return response.data }