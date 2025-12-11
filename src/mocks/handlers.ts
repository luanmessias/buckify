import { graphql, HttpResponse } from "msw"

export const handlers = [
	graphql.query("GetDashboardTransactions", () => {
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
			},
		})
	}),
]
