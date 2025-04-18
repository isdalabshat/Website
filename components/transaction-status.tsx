"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSiteContext } from "@/contexts/site-context"

interface UserData {
  name: string
  email: string
  balance: number
  isLoggedIn: boolean
}

export function TransactionStatus() {
  const [user, setUser] = useState<UserData | null>(null)
  const { transactions, currencySettings } = useSiteContext()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  // Filter transactions for the current user
  const userTransactions = user ? transactions.filter((t) => t.userId === user.email) : []

  // Sort transactions by timestamp (newest first)
  const sortedTransactions = [...userTransactions].sort((a, b) => b.timestamp - a.timestamp)

  // Get only the 5 most recent transactions
  const recentTransactions = sortedTransactions.slice(0, 5)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  if (recentTransactions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your recent deposit and withdrawal activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium capitalize">{transaction.type}</p>
                <p className="text-sm text-muted-foreground">{formatDate(transaction.timestamp)}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {currencySettings.symbol}
                  {transaction.amount.toFixed(2)}
                </p>
                {transaction.status === "pending" && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                )}
                {transaction.status === "approved" && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                )}
                {transaction.status === "rejected" && (
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Rejected
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

