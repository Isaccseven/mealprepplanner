import Meal from "@/components/meal";
import { useDrop } from "react-dnd";
import { useState } from "react";

interface MealData {
  mealName: string;
  mealPhoto: File | null;
}

interface PlanningBoardProps {
  weekday: string;
  meals: MealData[]; // Update the type to MealData[]
  moveMeal: (
    fromDay: string,
    toDay: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  addMeal: (day: string, mealName: string, mealPhoto: File) => void; // Update the addMeal function signature
  deleteMeal: (weekday: string, index: number) => void;
}

interface DragItem {
  index: number;
  type: string;
  weekday: string;
}

export default function PlanningBoard({
  weekday,
  meals,
  moveMeal,
  addMeal,
  deleteMeal,
}: PlanningBoardProps) {
  const [, drop] = useDrop<DragItem, {}, {}>({
    accept: "meal",
    drop(item: DragItem) {
      if (item.weekday !== weekday) {
        moveMeal(item.weekday, weekday, item.index, meals.length);
      }
      return {}; // Return an empty object
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMealName, setNewMealName] = useState("");
  const [mealPhoto, setMealPhoto] = useState<File | null>(null);

  const handleNewMealNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewMealName(event.target.value);
  };

  const handleMealPhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setMealPhoto(event.target.files[0]);
    }
  };

  const handleAddMeal = () => {
    if (newMealName.trim() !== "" && mealPhoto !== null) {
      addMeal(weekday, newMealName, mealPhoto);
      setNewMealName("");
      setMealPhoto(null);
      setIsModalOpen(false);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      ref={drop}
      className="flex-grow bg-gray-300 text-gray-800 m-3 w-1/6 text-center rounded-md"
    >
      <div>
        <button
          className="m-3 bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded"
          onClick={handleModalOpen}
        >
          Add Meal
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white flex flex-col justify-evenly rounded-lg p-8">
              <input
                className={
                  "m-2 p-2 border-4 border-dotted border-gray-400 text-center"
                }
                type="text"
                value={newMealName}
                onChange={handleNewMealNameChange}
                placeholder="Enter meal name"
              />
              <input
                className={
                  "m-2 p-2 border-4 border-dotted border-gray-400 text-center"
                }
                type="file"
                accept="image/*"
                onChange={handleMealPhotoChange}
              />
              <button
                className={"m-2 bg-gray-300 rounded"}
                onClick={handleAddMeal}
              >
                Add
              </button>
              <button
                className={"m-2 bg-gray-300 rounded"}
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {meals.map((meal, index) => (
        <Meal
          key={index}
          mealName={meal.mealName}
          index={index}
          weekday={weekday}
          image={meal.mealPhoto}
          moveMeal={moveMeal}
          deleteMeal={deleteMeal}
        />
      ))}
    </div>
  );
}
