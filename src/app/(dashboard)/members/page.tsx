"use client"


import React from 'react'
 import { UserProfileDrawer } from '@/components/base/drawer/user-drawer'

const Members = () => {
  const mockUser = {
    id: "1",
    username: "Antoine",
    avatar: {
      id: "av-1",
      name: "Pilote Rouge",
      image_url: "https://api.dicebear.com/9.x/bottts/svg?seed=Antoine",
    },
    favorite_car: {
      id: "car-1",
      name: "Inferno",
      rarity: "epic" as const,
      image_url: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
    },
    is_current_leader: true,
    seasons_won_count: 2,
    progress: 85,
    course_position: 1,
    daily_progress: 12.3,
    stats: {
      position: 1,
      points: 127,
      races_participated: 12,
      races_won: 5,
      seasons_won: 2,
    },
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-white mb-4">Members</h1>
      <UserProfileDrawer
        user={mockUser}
        salonName="EPITA Piscine"
        onAddFriend={(id) => console.log("Add friend:", id)}
      />
    </div>
  )
}

export default Members;