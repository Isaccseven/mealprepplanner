// Meal.tsx
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { useRef } from 'react';

interface DragItem {
    index: number;
    weekday: string;
    type: string;
}

interface MealProps {
    mealName: string;
    index: number;
    weekday: string;
    moveMeal: (fromDay: string, toDay: string, fromIndex: number, toIndex: number) => void;
    deleteMeal: (weekday: string, index: number) => void;
}

const Meal: React.FC<MealProps> = ({ mealName, index, weekday, moveMeal, deleteMeal }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'meal',
        item: { index, weekday } as DragItem,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop<DragItem, {}, {}>({
        accept: 'meal',
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;
            const dragDay = item.weekday;
            const hoverDay = weekday;

            if (dragIndex === hoverIndex && dragDay === hoverDay) {
                return;
            }

            moveMeal(dragDay, hoverDay, dragIndex, hoverIndex);
            item.index = hoverIndex;
            item.weekday = hoverDay;
        },
    });

    drag(drop(ref));

    const handleDeleteMeal = () => {
        deleteMeal(weekday, index);
    };

    return (
        <div className="m-3 bg-white  rounded p-2 flex items-center" ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <div className="flex-grow">{mealName}</div>
            <button className="ml-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white rounded" onClick={handleDeleteMeal}>
                X
            </button>
        </div>
    );
}

export default Meal;
