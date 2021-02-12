import useSWR from 'swr'
import buildClient from '../services/buildClient'

export function useFetch<Data = any, Error = any>(url: string, req: any) {
  const { data, error, mutate } = useSWR<Data, Error>(url, async url => {
    const { data } = await buildClient(req).get(url)
    return data
  })

  return { data, isError: error, mutate, isLoading: !error && !data }
}
