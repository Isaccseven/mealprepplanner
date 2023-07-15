"use client"
import { useState, useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NavigationBar from '@/components/navigation_bar';
import { DndProvider } from 'react-dnd';
import Weekday from '@/components/week_day';
import dynamic from "next/dynamic";

interface MealPlan {
    [day: string]: string[];
}

const PlanningBoard = dynamic(() => import('@/components/planning_board'), {
    ssr: false,
});

export default function Home() {
    const weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
        if (typeof window !== 'undefined') {
            const storedPlan = localStorage.getItem('mealPlan');
            if (storedPlan) {
                return JSON.parse(storedPlan);
            }
        }
        return weekdays.reduce((plan: MealPlan, day) => ({ ...plan, [day]: [] }), {});
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
        }
    }, [mealPlan]);

    const moveMeal = (fromDay: string, toDay: string, fromIndex: number, toIndex: number) => {
        const newMealPlan = { ...mealPlan };
        const meal = newMealPlan[fromDay][fromIndex];

        newMealPlan[fromDay] = newMealPlan[fromDay].filter((_, index) => index !== fromIndex);
        newMealPlan[toDay] = [
            ...newMealPlan[toDay].slice(0, toIndex),
            meal,
            ...newMealPlan[toDay].slice(toIndex),
        ];

        setMealPlan(newMealPlan);
    };

    const addMeal = (day: string, mealName: string) => {
        const newMealPlan = { ...mealPlan };
        newMealPlan[day].push(mealName);
        setMealPlan(newMealPlan);
    };

    const deleteMeal = (weekday: string, index: number) => {
        const newMealPlan = { ...mealPlan };
        newMealPlan[weekday] = newMealPlan[weekday].filter((_, mealIndex) => mealIndex !== index);
        setMealPlan(newMealPlan);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen" >
                <NavigationBar />
                <div id="weekdays" className="bg-gray-800 flex justify-between">
                    {weekdays.map((day, i) => {
                        return <Weekday key={i} weekdayName={day} />;
                    })}
                </div>
                <div className="flex-grow bg-gray-500 flex flex-col">
                    <div id="planningBoardContainer" className="flex flex-grow justify-between">
                        {weekdays.map((day, i) => {
                            return (
                                <PlanningBoard
                                    key={i}
                                    weekday={day}
                                    meals={mealPlan[day]}
                                    moveMeal={moveMeal}
                                    addMeal={addMeal}
                                    deleteMeal={deleteMeal}
                                />
                            );
                        })}
                    </div>
                </div>
                <div id="footer" className="bg-gray-600 h-20" />
            </div>
        </DndProvider>
    );
}
