import useSWR from 'swr'

import axios from 'axios'

export function useFetch<Data = any, Error = any>(url: string) {
  const { data, error, mutate } = useSWR<Data, Error>(url, async url => {
    const { data } = await axios.get<Data>(url)
    return data
  })

  return { data, isError: error, mutate, isLoading: !error && !data }
}
