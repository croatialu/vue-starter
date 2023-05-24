export function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export function createContext<T>(identifier: string) {
  const symbol = Symbol(identifier)

  const useProvide = (value: T) => {
    return provide(symbol, value)
  }

  const useInject = () => {
    const value = inject(symbol)
    if (!value)
      throw new Error('useInject must be used after useProvide')

    return value as T
  }

  return {
    useProvide,
    useInject,
  }
}

export type ValueGetter<T, P = Record<string, any>> = T | ((params: P) => T)

export type ValueGetterAsync<T, P = Record<string, any>> = ValueGetter<T, P> | ((params: P) => Promise<T>)

export type OriginValueType<T> = T extends ValueGetterAsync<infer U> ? U : T extends ValueGetter<infer U> ? U : never

export function getValue<T, P extends Record<string, any>>(value: ValueGetter<T, P>, params = {} as P): T {
  if (typeof value === 'function')
    return (value as (p: P) => T)(params)

  return value
}
