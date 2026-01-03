export const typeDefs = `#graphql
  
  type ShoppingItem {
    name: String!
    price: Float
    quantity: Int
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    categoryId: String!
    date: String!
    createdAt: Float
    createdBy: String
  }

  type Category {
    id: String!
    budget: Float!
    color: String
    description: String!
    icon: String
    name: String!
    slug: String
  }

  type ShoppingHistory {
    id: ID!
    date: String!
    total: Float!
    timestamp: Float
    items: [ShoppingItem]! 
  }

  type WishlistItem {
    id: ID!
    name: String!
    estimatedPrice: Float
    priority: String
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
    originalPrice: Float 
    quantity: Int
    isChecked: Boolean
    createdAt: Float
  }

  input CreateTransactionInput {
    date: String!
    description: String!
    amount: Float!
    categoryId: String!
  }

  input UpdateCategoryInput {
    name: String
    description: String
    budget: Float
    color: String
    icon: String
  }

  input UpdateTransactionInput {
    date: String
    description: String
    amount: Float
    categoryId: String
  }

  type MutationResponse {
    success: Boolean!
    message: String
  }

  type Mutation {
    createManyTransactions(householdId: String!, transactions: [CreateTransactionInput!]!): MutationResponse
    updateCategory(id: String!, householdId: String!, input: UpdateCategoryInput!): MutationResponse
    updateTransaction(id: String!, householdId: String!, input: UpdateTransactionInput!): MutationResponse
  }

  type Query {
    getTransactions(startDate: String!, endDate: String!, householdId: String!, categoryId: String): [Transaction]
    getCategories(householdId: String!): [Category]
    getCategory(id: String!, householdId: String!): Category
    getShoppingHistory: [ShoppingHistory]
    getWishlist: [WishlistItem]
    getProductCatalog: [Product]
    getShoppingList: [ShoppingListItem]
  }
`
