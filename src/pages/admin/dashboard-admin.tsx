'use client'

import { FC, useEffect, useState } from 'react'
import { StatisticApi } from '@/api/page'
import { StatisticModel } from '@/models'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components'
import { Users, School, GraduationCap, FileQuestion, ClipboardList, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

const DashboardAdmin: FC = () => {
    const [statistics, setStatistics] = useState<StatisticModel | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchStatistics = async () => {
        try {
            setIsLoading(true)
            const response = await StatisticApi.getStatistic()
            if (response.data) {
                setStatistics(response.data.data)
            }
        } catch (error: any) {
            toast.error('Failed to load statistics', {
                description: error?.message || 'Please try again'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStatistics()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    const stats = [
        {
            title: 'Total Classes',
            value: statistics?.total_classes || 0,
            icon: School,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Total Teachers',
            value: statistics?.total_teachers || 0,
            icon: GraduationCap,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Total Students',
            value: statistics?.total_students || 0,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Total Questions',
            value: statistics?.total_questions || 0,
            icon: FileQuestion,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        },
        {
            title: 'Total Exams',
            value: statistics?.total_exams || 0,
            icon: ClipboardList,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        },
        {
            title: 'Question Banks',
            value: statistics?.total_question_banks || 0,
            icon: Database,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100'
        }
    ]

    return (
        <div className="container mx-auto py-4 px-0">
            <motion.h1 
                className="text-2xl font-bold mb-8 text-left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Dashboard Overview
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="overflow-hidden">
                            <CardHeader className={`flex flex-row items-center justify-between pb-2 ${stat.bgColor}`}>
                                <CardTitle className="text-lg font-semibold">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default DashboardAdmin

