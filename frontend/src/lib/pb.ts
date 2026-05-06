import PocketBase from 'pocketbase'

// 部署后替换这个 URL
const PB_URL = import.meta.env.VITE_PB_URL || 'http://localhost:8090'

const pb = new PocketBase(PB_URL)

export default pb

// 便利的 CRUD 操作 ──────────────────────────────────────────

export const turtles = {
  list: (page = 1, perPage = 50) =>
    pb.collection('turtles').getList(page, perPage, { sort: '-created' }),
  get: (id: string) => pb.collection('turtles').getOne(id),
  create: (data: Record<string, unknown>) => pb.collection('turtles').create(data),
  update: (id: string, data: Record<string, unknown>) => pb.collection('turtles').update(id, data),
  delete: (id: string) => pb.collection('turtles').delete(id),
}

export const feedingLogs = {
  list: (page = 1, perPage = 50) =>
    pb.collection('feeding_logs').getList(page, perPage, {
      sort: '-date',
      expand: 'turtle',
      perPage,
    }),
  create: (data: Record<string, unknown>) => pb.collection('feeding_logs').create(data),
  delete: (id: string) => pb.collection('feeding_logs').delete(id),
}

export const waterChanges = {
  list: (page = 1, perPage = 50) =>
    pb.collection('water_changes').getList(page, perPage, { sort: '-date', perPage }),
  create: (data: Record<string, unknown>) => pb.collection('water_changes').create(data),
  delete: (id: string) => pb.collection('water_changes').delete(id),
}

export const growthRecords = {
  list: (page = 1, perPage = 50) =>
    pb.collection('growth_records').getList(page, perPage, {
      sort: '-date',
      expand: 'turtle',
      perPage,
    }),
  create: (data: Record<string, unknown>) => pb.collection('growth_records').create(data),
  delete: (id: string) => pb.collection('growth_records').delete(id),
}

export const environmentLogs = {
  list: (page = 1, perPage = 50) =>
    pb.collection('environment_logs').getList(page, perPage, { sort: '-date', perPage }),
  create: (data: Record<string, unknown>) => pb.collection('environment_logs').create(data),
  delete: (id: string) => pb.collection('environment_logs').delete(id),
}

export const healthLogs = {
  list: (page = 1, perPage = 50) =>
    pb.collection('health_logs').getList(page, perPage, {
      sort: '-date',
      expand: 'turtle',
      perPage,
    }),
  create: (data: Record<string, unknown>) => pb.collection('health_logs').create(data),
  delete: (id: string) => pb.collection('health_logs').delete(id),
}
