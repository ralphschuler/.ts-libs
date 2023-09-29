class BetterSet<v> extends Set<v> {

  filter(predicate: (v: v) => boolean) {
    const newSet = new BetterSet<v>()
    const entries = Array.from(this.entries())
    for(const [value] of entries) {
      if (predicate(value)) newSet.add(value)
    }
    return newSet
  }

  merge(set: Set<v>) {
    const entries = Array.from(set.entries())
    for (const kv of entries) {
      this.add(kv[0])
    }
  }

  except(set: Set<v>) {
    const newSet = new Set<v>()
    const entries = Array.from(set.entries())
    for(const [value] of entries) {
      if(!this.has(value)) newSet.add(value)
    }
    return newSet
  }

  both(set: Set<v>) {
    const newSet = new Set<v>()
    const entries = Array.from(set.entries())
    for(const [value] of entries) {
      if (this.has(value)) newSet.add(value)
    }
    return newSet
  }
}