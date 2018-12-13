
import axios from '../../components/interceptor'
export default {

  roleList: async(pid) => {
    const rest = await axios.get(`/api/organizations/actions/query/${pid}`)
    return rest.data
  },
  sections: async() => {
    const rest = await axios.get(`/api/organizations/actions/queryAll`)
    return rest.data
  },
  create: async(form) => {
    console.log(form)
    const rest = await axios.post('/api/organizations', form)
    return rest.data
  },
  remove: async(id) => {
    const rest = await axios.delete(`/api/organizations/${id}`)
    return rest.data
  },
  update: async(editdata) => {
    const rest = await axios.put('/api/organizations', editdata)
    return rest.data
  }
}

