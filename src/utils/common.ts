export function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export function createContext<T>(key: string) {
  const k = Symbol(key)
  const useProvide = (value: T) => {
    return provide<T>(k, value)
  }

  const useInject = () => {
    const result = inject<T>(k)
    if (!result)
      throw new Error('need provide')
    return result
  }

  return [useProvide, useInject] as const
}
