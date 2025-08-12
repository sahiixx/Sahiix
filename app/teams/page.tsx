"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { getTeams, getTeamMembers, getTeamActivities } from "@/lib/team-database"
import type { Team, TeamMember } from "@/lib/types"
import { Users, Plus, Settings, ActivityIcon, Crown, Shield, User, Eye } from "lucide-react"
import Link from "next/link"

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const teams = getTeams()
  const teamMembers = selectedTeam ? getTeamMembers(selectedTeam.id) : []
  const activities = selectedTeam ? getTeamActivities(selectedTeam.id) : []

  const getRoleIcon = (role: TeamMember["role"]) => {
    switch (role) {
      case "Owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "Admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "Member":
        return <User className="h-4 w-4 text-green-500" />
      case "Viewer":
        return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Free":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "Pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Enterprise":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Teams & Collaboration
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Manage your teams and collaborate on AI tools and workflows
              </p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Team
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Teams List */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold mb-6">Your Teams</h2>
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTeam?.id === team.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={team.avatar || "/placeholder.svg"} alt={team.name} />
                          <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <CardDescription className="text-sm">{team.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getPlanColor(team.plan)}`}>{team.plan}</Badge>
                          <span className="text-sm text-muted-foreground">{team.memberCount} members</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Details */}
            <div className="lg:col-span-2">
              {selectedTeam ? (
                <div className="space-y-6">
                  {/* Team Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={selectedTeam.avatar || "/placeholder.svg"} alt={selectedTeam.name} />
                            <AvatarFallback className="text-xl">{selectedTeam.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-3xl font-bold">{selectedTeam.name}</h2>
                            <p className="text-muted-foreground">{selectedTeam.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge className={`${getPlanColor(selectedTeam.plan)}`}>{selectedTeam.plan}</Badge>
                              <span className="text-sm text-muted-foreground">
                                Created {formatTimeAgo(selectedTeam.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Invite
                          </Button>
                          <Button variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Team Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Members ({teamMembers.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{member.name}</span>
                                  {getRoleIcon(member.role)}
                                  <Badge variant="outline" className="text-xs">
                                    {member.role}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Last active {formatTimeAgo(member.lastActive)}
                              </p>
                              <p className="text-xs text-muted-foreground">Joined {formatTimeAgo(member.joinedAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={activity.userAvatar || "/placeholder.svg"} alt={activity.userName} />
                              <AvatarFallback className="text-xs">{activity.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{activity.userName}</span>{" "}
                                <span className="text-muted-foreground">{activity.action}</span>{" "}
                                <Link
                                  href={`/${activity.resourceType}s/${activity.resourceId}`}
                                  className="text-primary hover:underline"
                                >
                                  {activity.resourceTitle}
                                </Link>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.resourceType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Team</h3>
                    <p className="text-muted-foreground">
                      Choose a team from the left to view details and manage members
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
