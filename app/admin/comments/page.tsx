"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Trash2, Flag } from "lucide-react"

const comments = [
  {
    id: "1",
    user: "John Doe",
    item: "Professional Camera Kit",
    rating: 5,
    comment: "Excellent camera kit! Everything was in perfect condition and the owner was very responsive.",
    time: "2 hours ago",
    status: "published",
  },
  {
    id: "2",
    user: "Sarah Wilson",
    item: "Luxury Camping Tent",
    rating: 4,
    comment: "Great tent, very spacious. Only issue was a small tear that was already noted.",
    time: "5 hours ago",
    status: "published",
  },
  {
    id: "3",
    user: "Mike Johnson",
    item: "DJ Sound System",
    rating: 5,
    comment: "Amazing sound quality! Perfect for my event. Highly recommend.",
    time: "1 day ago",
    status: "published",
  },
  {
    id: "4",
    user: "Emma Davis",
    item: "Professional Camera Kit",
    rating: 3,
    comment: "Camera was good but delivery was delayed. Otherwise satisfied with the rental.",
    time: "2 days ago",
    status: "flagged",
  },
]

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Comments & Reviews</h1>
          <p className="text-muted-foreground">Manage customer feedback and reviews</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {comments.length} Total
        </Badge>
      </div>

      <div className="grid gap-4">
        {comments.map((comment) => (
          <Card
            key={comment.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              comment.status === "flagged" ? "border-yellow-400 border-2" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-[#2B70FF] to-[#1A4FCC] text-white">
                    {comment.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{comment.user}</h4>
                      <p className="text-sm text-muted-foreground">on {comment.item}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                      {comment.status === "flagged" && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Flag className="h-3 w-3 mr-1" />
                          Flagged
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < comment.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-2">{comment.rating}.0</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{comment.comment}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                    {comment.status === "flagged" && (
                      <Button variant="outline" size="sm">
                        Approve
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
