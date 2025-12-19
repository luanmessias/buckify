import { graphql, HttpResponse } from "msw"

export const handlers = [
	graphql.query("GetDashboardData", () => {
		return HttpResponse.json({
			data: {
				getTransactions: [
					{
						id: "1",
						description: "Salario Mockado",
						amount: 5000.0,
						categoryId: "Receita",
						date: "2025-10-01",
					},
					{
						id: "2",
						description: "Netflix Mockado",
						amount: 39.9,
						categoryId: "Assinatura",
						date: "2025-10-05",
					},
				],
				getCategories: [
					{
						id: "Receita",
						name: "Receita",
						budget: 10000,
						color: "#00ff00",
						icon: "TrendingUp",
					},
					{
						id: "Assinatura",
						name: "Assinatura",
						budget: 100,
						color: "#ff0000",
						icon: "CreditCard",
					},
				],
			},
		})
	}),
]
