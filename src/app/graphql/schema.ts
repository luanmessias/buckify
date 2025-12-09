export const typeDefs = `#graphql
  # -- TIPOS AUXILIARES --
  
  # O item individual dentro da lista de compras passada
  type ShoppingItem {
    name: String!
    price: Float
    quantity: Int
  }

  # -- ENTIDADES PRINCIPAIS --

  type Transaction {
    id: ID!
    description: String!   # No banco é 'description'
    amount: Float!
    categoryId: String!    # No banco é 'categoryId'
    date: String!          # Ex: "2025-12-07"
    createdAt: Float       # Timestamp numérico
    createdBy: String
  }

  type ShoppingHistory {
    id: ID!
    date: String!
    total: Float!
    timestamp: Float
    items: [ShoppingItem]! # Array de objetos (Isso é muito legal de mostrar!)
  }

  type WishlistItem {
    id: ID!
    name: String!
    estimatedPrice: Float
    priority: String       # Ex: "want"
    url: String
    beneficiary: String
    createdAt: Float
  }

  type Product {
    id: ID!
    name: String!
    lastPrice: Float
    updatedAt: Float
  }

  type ShoppingListItem {
    id: ID!
    name: String!
    estimatedPrice: Float
    originalPrice: Float   # Pode ser null
    quantity: Int
    isChecked: Boolean
    createdAt: Float
  }

  # -- A QUERY (O CARDÁPIO) --

  type Query {
    getTransactions: [Transaction]
    getShoppingHistory: [ShoppingHistory]
    getWishlist: [WishlistItem]
    getProductCatalog: [Product]
    getShoppingList: [ShoppingListItem]
  }
`
