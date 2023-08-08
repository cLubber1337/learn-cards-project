export interface DecksResponse {
  maxCardsCount: number
  pagination: PaginationType
  items: Deck[]
}
export interface PaginationType {
  totalPages: number
  currentPage: number
  itemsPerPage: number
  totalItems: number
}
export interface Author {
  id: string
  name: string
}
export interface Deck {
  id: string
  userId: string
  name: string
  isPrivate: boolean
  shots: number
  cover: string | null
  rating: number
  isDeleted?: any
  isBlocked?: any
  created: string
  updated: string
  cardsCount: number
  author: Author
}
