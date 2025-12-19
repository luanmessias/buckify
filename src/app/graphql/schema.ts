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
    name: String !
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


  type Query {
    getTransactions(startDate: String, endDate: String): [Transaction]
    getCategories(houseHoldId: String): [Category]
    getShoppingHistory: [ShoppingHistory]
    getWishlist: [WishlistItem]
    getProductCatalog: [Product]
    getShoppingList: [ShoppingListItem]
  }
`
