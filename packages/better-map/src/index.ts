class BetterMap<k, v> extends Map<k, v> {
  update(key:k, updater: (v:v, k:k) => v, notset:v = undefined) {
    if(this.has(key)) this.set(key, updater(this.get(key), key))
    else this.set(key, notset)
  }

  filter(predicate: (v:v, k:k) => boolean) {
    const newMap = new BetterMap<k, v>()
    const entries = Array.from(this.entries())
    for(const [key, value] of entries) {
      if(predicate(value, key)) newMap.set(key, value)
    }
    return newMap
  }

  merge(map: Map<k, v>, resolve: (k:k, a:v, b:v) => v = (k, a, b) => b) {
    const entries = Array.from(map.entries())
    for(const [key, value] of entries) {
      if(this.has(key)) this.set(key, resolve(key, this.get(key), value))
      else this.set(key, value)
    }
  }
}