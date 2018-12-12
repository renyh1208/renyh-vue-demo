
import axios from 'axios'
export default {
  login: async(loginForm) => {
    console.log(loginForm)
    const rest = await axios.post(`/api/users/actions/login`, loginForm)
    console.log(rest)
    return rest.data
  },
  queryUserList: async({ pageIndex, pageSize }, userName, oid) => {
    const rest = await axios.get(`/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}&userName=${userName}&oid=${oid}`)
    console.log(rest)
    return rest.data
  },
  create: async(userform) => {
    console.log(userform)
    const rest = await axios.post('/api/users', userform)
    return rest.data
  },
  remove: async(id) => {
    const resp = await axios.delete(`/api/users/${id}`)
    return resp.data
  },
  update: async(userform) => {
    const rest = await axios.put('/api/users', userform)
    return rest.data
  }
}
