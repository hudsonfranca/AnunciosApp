import useSWR from 'swr'
import api from '../services/api'

export function useFetch<Data = any, Error = any>(url: string) {
  const { data, error, mutate } = useSWR<Data, Error>(url, async url => {
    const { data } = await api.get(url)
    return data
  })

  return { data, isError: error, mutate, isLoading: !error && !data }
}