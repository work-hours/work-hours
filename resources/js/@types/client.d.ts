export type Client = {
    id: number
    name: string
    email: string | null
    contact_person: string | null
    phone: string | null
    address: string | null
    notes: string | null
    hourly_rate: number | null
    currency: string | null
}

export type ClientFilters = {
    search: string
    'created-date-from': Date | string | null
    'created-date-to': Date | string | null
}

export type ClientPageProps = {
    clients: Client[]
    filters: ClientFilters
    currencies?: { id: number; code: string }[]
}

export type ClientCurrency = {
    id: number
    user_id: number
    code: string
    created_at: string
    updated_at: string
}
